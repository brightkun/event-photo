import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../plugins/pg";
import { apiError } from "../utils/apiError";

interface IRegisterBody {
  name?: string;
  email?: string;
  password?: string;
}

interface ILoginBody {
  email?: string;
  password?: string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
}

const userColumns = "id, name, email, role, created_at";

const TOKEN_DAYS = 30;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) throw new Error("JWT_SECRET is not set");

  return secret;
};

export const tokenMaxAge = TOKEN_DAYS * 24 * 60 * 60 * 1000;

export const signToken = (userId: number) =>
  jwt.sign({ sub: String(userId) }, getSecret(), {
    expiresIn: `${TOKEN_DAYS}d`,
  });

// Возвращает пользователя по токену из cookie или null, если токен плохой или пользователя удалили.
export const findUserByToken = async (token: string | undefined) => {
  if (!token) return null;

  let userId: number;

  try {
    const payload = jwt.verify(token, getSecret());
    userId = Number(typeof payload === "string" ? payload : payload.sub);
  } catch {
    return null;
  }

  if (!Number.isInteger(userId)) return null;

  const res = await pool.query(
    `select ${userColumns} from users where id = $1`,
    [userId],
  );

  return (res.rows[0] as IUser | undefined) ?? null;
};

export const registerService = async (body: IRegisterBody) => {
  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!name || !email || !password) {
    throw apiError.badRequest("name, email and password are required");
  }

  if (name.length > 60) throw apiError.badRequest("name is too long");

  if (!emailRegex.test(email)) throw apiError.badRequest("email is invalid");

  if (password.length < 8 || password.length > 72) {
    throw apiError.badRequest("password must be 8 to 72 characters");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const res = await pool.query(
      `
      insert into users
      (name, email, password_hash)
      values ($1, $2, $3)
      returning ${userColumns}
      `,
      [name, email, passwordHash],
    );

    return res.rows[0] as IUser;
  } catch (error: any) {
    // 23505 = нарушение unique, значит такой email уже есть
    if (error.code === "23505") {
      throw apiError.conflict("This email is already registered");
    }

    throw error;
  }
};

export const loginService = async (body: ILoginBody) => {
  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    throw apiError.badRequest("email and password are required");
  }

  const res = await pool.query(
    `select ${userColumns}, password_hash from users where email = $1`,
    [email],
  );

  const row = res.rows[0];
  const isValid = row ? await bcrypt.compare(password, row.password_hash) : false;

  if (!row || !isValid) {
    throw apiError.unauthorized("Invalid email or password");
  }

  const { password_hash, ...user } = row;
  return user as IUser;
};
