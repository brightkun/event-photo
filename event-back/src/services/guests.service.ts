import { randomBytes } from "crypto";
import { pool } from "../plugins/pg";
import { notifyEvent } from "../plugins/realtime";
import { apiError } from "../utils/apiError";

interface IBody {
  name: string;
}

export const postGuestService = async (slug: string, body: IBody) => {
  const name = body.name?.trim();

  if (!name) {
    throw apiError.badRequest("name is required");
  }

  if (name.length > 50) {
    throw apiError.badRequest("name is too long");
  }

  const event = await pool.query("select id from events where slug = $1", [
    slug,
  ]);

  if (!event.rows[0]) throw apiError.notFound("Event is not found");

  const token = randomBytes(16).toString("hex");

  const res = await pool.query(
    `
    insert into guests
    (event_id, name, token)
    values ($1, $2, $3)
    returning id, name, token, created_at
    `,
    [event.rows[0].id, name, token],
  );

  await notifyEvent(slug);

  return res.rows[0];
};
