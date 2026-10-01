import { pool } from "../plugins/pg";
import { apiError } from "./apiError";

export const getEventId = async (slug: string) => {
  const res = await pool.query("select id from events where slug = $1", [
    slug,
  ]);

  if (!res.rows[0]) throw apiError.notFound("Event is not found");

  return res.rows[0].id as number;
};

export const getPhotoId = async (eventId: number, photoId: string) => {
  const id = Number(photoId);

  if (!Number.isInteger(id)) throw apiError.notFound("Photo is not found");

  const res = await pool.query(
    "select id from photos where id = $1 and event_id = $2",
    [id, eventId],
  );

  if (!res.rows[0]) throw apiError.notFound("Photo is not found");

  return id;
};

export const findGuestId = async (
  eventId: number,
  token: string | undefined,
) => {
  if (!token) return null;

  const res = await pool.query(
    "select id from guests where token = $1 and event_id = $2",
    [token, eventId],
  );

  return (res.rows[0]?.id as number | undefined) ?? null;
};

export const getGuestId = async (eventId: number, token: string | undefined) => {
  if (!token) throw apiError.unauthorized("Guest token is required");

  const guestId = await findGuestId(eventId, token);

  if (!guestId) throw apiError.unauthorized("Guest is not found");

  return guestId;
};
