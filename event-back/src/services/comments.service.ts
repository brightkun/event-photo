import { pool } from "../plugins/pg";
import { notifyEvent } from "../plugins/realtime";
import { apiError } from "../utils/apiError";
import { getEventId, getGuestId, getPhotoId } from "../utils/queries";

interface IBody {
  text: string;
}

export const getCommentsService = async (slug: string, photoId: string) => {
  const eventId = await getEventId(slug);
  const id = await getPhotoId(eventId, photoId);

  const res = await pool.query(
    `
    select c.id, c.text, c.created_at, g.name as guest_name
    from comments c
    join guests g on g.id = c.guest_id
    where c.photo_id = $1
    order by c.created_at asc, c.id asc
    `,
    [id],
  );

  return res.rows;
};

export const postCommentService = async (
  slug: string,
  photoId: string,
  token: string | undefined,
  body: IBody,
) => {
  const text = body.text?.trim();

  if (!text) throw apiError.badRequest("text is required");

  if (text.length > 500) throw apiError.badRequest("text is too long");

  const eventId = await getEventId(slug);
  const id = await getPhotoId(eventId, photoId);
  const guestId = await getGuestId(eventId, token);

  const res = await pool.query(
    `
    with inserted as (
      insert into comments
      (photo_id, guest_id, text)
      values ($1, $2, $3)
      returning id, text, created_at, guest_id
    )
    select inserted.id, inserted.text, inserted.created_at, g.name as guest_name
    from inserted
    join guests g on g.id = inserted.guest_id
    `,
    [id, guestId, text],
  );

  await notifyEvent(slug);

  return res.rows[0];
};
