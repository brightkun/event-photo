import { pool } from "../plugins/pg";
import { notifyEvent } from "../plugins/realtime";
import { apiError } from "../utils/apiError";
import { getEventId, getGuestId, getPhotoId } from "../utils/queries";

const EMOJIS = ["♥", "😂", "🔥"];

interface IBody {
  emoji: string;
}

export const getReactionsSummary = async (
  photoId: number,
  guestId: number | null,
) => {
  const res = await pool.query(
    `
    select emoji, count(*)::int as count, coalesce(bool_or(guest_id = $2), false) as reacted
    from reactions
    where photo_id = $1
    group by emoji
    `,
    [photoId, guestId],
  );

  return EMOJIS.map((emoji) => {
    const row = res.rows.find((item) => item.emoji === emoji);
    return {
      emoji,
      count: (row?.count as number | undefined) ?? 0,
      reacted: (row?.reacted as boolean | undefined) ?? false,
    };
  });
};

export const toggleReactionService = async (
  slug: string,
  photoId: string,
  token: string | undefined,
  body: IBody,
) => {
  if (!EMOJIS.includes(body.emoji)) {
    throw apiError.badRequest("Unsupported reaction");
  }

  const eventId = await getEventId(slug);
  const id = await getPhotoId(eventId, photoId);
  const guestId = await getGuestId(eventId, token);

  const removed = await pool.query(
    `
    delete from reactions
    where photo_id = $1 and guest_id = $2 and emoji = $3
    returning id
    `,
    [id, guestId, body.emoji],
  );

  if (!removed.rows[0]) {
    await pool.query(
      `
      insert into reactions
      (photo_id, guest_id, emoji)
      values ($1, $2, $3)
      `,
      [id, guestId, body.emoji],
    );
  }

  await notifyEvent(slug);

  return getReactionsSummary(id, guestId);
};
