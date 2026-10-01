import { randomBytes } from "crypto";
import { pool } from "../plugins/pg";
import { apiError } from "../utils/apiError";

interface IBody {
  name: string;
  date: string;
  location: string;
}

const columns = `id, slug, name, to_char(date, 'YYYY-MM-DD') as date, location, created_at`;

export const postEventService = async (body: IBody) => {
  if (!body.name?.trim() || !body.date || !body.location?.trim()) {
    throw apiError.badRequest("name, date and location are required");
  }

  if (Number.isNaN(new Date(body.date).getTime())) {
    throw apiError.badRequest("date is invalid");
  }

  const slug = randomBytes(6).toString("base64url");

  const res = await pool.query(
    `
    insert into events
    (slug, name, date, location)
    values ($1, $2, $3, $4)
    returning ${columns}
    `,
    [slug, body.name.trim(), body.date, body.location.trim()],
  );

  return res.rows[0];
};

export const getEventBySlugService = async (slug: string) => {
  const res = await pool.query(
    `
    select ${columns},
      (select count(*)::int from photos where event_id = events.id) as photos_count,
      (select count(*)::int from guests where event_id = events.id) as guests_count
    from events
    where slug = $1
    `,
    [slug],
  );

  if (!res.rows[0]) throw apiError.notFound("Event is not found");

  return res.rows[0];
};
