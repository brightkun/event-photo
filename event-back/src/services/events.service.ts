import { randomBytes } from "crypto";
import { pool } from "../plugins/pg";
import { removeFile } from "../plugins/storage";
import { apiError } from "../utils/apiError";
import { getEventId } from "../utils/queries";
import { IUser } from "./auth.service";

interface IBody {
  name: string;
  date: string;
  location: string;
}

const columns = `id, slug, name, to_char(date, 'YYYY-MM-DD') as date, location, created_at`;

const counts = `
  (select count(*)::int from photos where event_id = events.id) as photos_count,
  (select count(*)::int from guests where event_id = events.id) as guests_count
`;

export const postEventService = async (body: IBody, user: IUser) => {
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
    (slug, name, date, location, user_id)
    values ($1, $2, $3, $4, $5)
    returning ${columns}
    `,
    [slug, body.name.trim(), body.date, body.location.trim(), user.id],
  );

  return res.rows[0];
};

export const getEventBySlugService = async (slug: string) => {
  const res = await pool.query(
    `
    select ${columns}, ${counts}
    from events
    where slug = $1
    `,
    [slug],
  );

  if (!res.rows[0]) throw apiError.notFound("Event is not found");

  return res.rows[0];
};

export const getMyEventsService = async (user: IUser) => {
  const res = await pool.query(
    `
    select ${columns}, ${counts}
    from events
    where user_id = $1
    order by created_at desc, id desc
    `,
    [user.id],
  );

  return res.rows;
};

// Удалять может владелец или admin. Каскад в базе файлы не трогает,
// поэтому сначала собираем пути фото и после удаления чистим хранилище.
export const deleteEventService = async (slug: string, user: IUser) => {
  const eventId = await getEventId(slug);

  const owner = await pool.query("select user_id from events where id = $1", [
    eventId,
  ]);

  if (user.role !== "admin" && owner.rows[0]?.user_id !== user.id) {
    throw apiError.forbidden("You can delete only your own events");
  }

  const photos = await pool.query(
    "select path from photos where event_id = $1",
    [eventId],
  );

  await pool.query("delete from events where id = $1", [eventId]);

  await Promise.allSettled(
    photos.rows.map((photo) => removeFile(photo.path as string)),
  );

  return { id: eventId };
};
