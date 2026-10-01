import "dotenv/config";
import { Pool } from "pg";

// На Vercel и в проде подключаемся по DATABASE_URL (Supabase pooler),
// локально можно по отдельным переменным DB_*.
export const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 3,
      }
    : {
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      },
);

pool
  .query("select 1")
  .then(() => console.log(`Connected to DB`))
  .catch((error) => console.error("DB connection failed:", error.message));
