import { pool } from "../plugins/pg";
import { notifyEvent } from "../plugins/realtime";
import { removeFile, saveFile } from "../plugins/storage";
import { apiError } from "../utils/apiError";
import {
  findGuestId,
  getEventId,
  getGuestId,
  getPhotoId,
} from "../utils/queries";
import { getReactionsSummary } from "./reactions.service";

interface IBody {
  width?: string;
  height?: string;
}

const parseSize = (value: string | undefined) => {
  const size = Number(value);

  if (!Number.isInteger(size) || size <= 0 || size > 20000) {
    throw apiError.badRequest("width and height must be positive integers");
  }

  return size;
};

export const getPhotosService = async (slug: string) => {
  const eventId = await getEventId(slug);

  const res = await pool.query(
    `
    select
      p.id, p.path, p.width, p.height, p.created_at,
      g.name as guest_name,
      top.emoji as top_emoji, top.count as top_count
    from photos p
    join guests g on g.id = p.guest_id
    left join lateral (
      select emoji, count(*)::int as count
      from reactions r
      where r.photo_id = p.id
      group by emoji
      order by count desc, emoji
      limit 1
    ) top on true
    where p.event_id = $1
    order by p.created_at desc, p.id desc
    `,
    [eventId],
  );

  return res.rows.map(({ path, ...photo }) => ({
    ...photo,
    url: path,
  }));
};

export const getPhotoService = async (
  slug: string,
  photoId: string,
  token: string | undefined,
  isAdmin: boolean,
) => {
  const eventId = await getEventId(slug);
  const id = await getPhotoId(eventId, photoId);
  const guestId = await findGuestId(eventId, token);

  const res = await pool.query(
    `
    select
      p.id, p.path, p.width, p.height, p.created_at,
      g.name as guest_name,
      (coalesce(p.guest_id = $2, false) or $3) as is_owner,
      (select count(*)::int from comments where photo_id = p.id) as comments_count
    from photos p
    join guests g on g.id = p.guest_id
    where p.id = $1
    `,
    [id, guestId, isAdmin],
  );

  const { path, ...photo } = res.rows[0];
  const reactions = await getReactionsSummary(id, guestId);

  return { ...photo, url: path, reactions };
};

export const postPhotoService = async (
  slug: string,
  token: string | undefined,
  file: Express.Multer.File | undefined,
  body: IBody,
) => {
  const eventId = await getEventId(slug);
  const guestId = await getGuestId(eventId, token);

  if (!file) throw apiError.badRequest("Photo is required (jpeg, png or webp)");

  const width = parseSize(body.width);
  const height = parseSize(body.height);

  const path = await saveFile(file.buffer, file.mimetype);

  const res = await pool.query(
    `
    insert into photos
    (event_id, guest_id, path, width, height)
    values ($1, $2, $3, $4, $5)
    returning id, path, width, height, created_at
    `,
    [eventId, guestId, path, width, height],
  );

  await notifyEvent(slug);

  const { path: savedPath, ...photo } = res.rows[0];
  return { ...photo, url: savedPath };
};

export const deletePhotoService = async (
  slug: string,
  photoId: string,
  token: string | undefined,
  isAdmin: boolean,
) => {
  const eventId = await getEventId(slug);
  const id = await getPhotoId(eventId, photoId);

  // admin удаляет любое фото, гость только своё
  const guestId = isAdmin ? null : await getGuestId(eventId, token);

  const res = await pool.query(
    `
    delete from photos
    where id = $1 and ($3 or guest_id = $2)
    returning id, path
    `,
    [id, guestId, isAdmin],
  );

  if (!res.rows[0]) {
    throw apiError.forbidden("You can delete only your own photos");
  }

  await removeFile(res.rows[0].path);
  await notifyEvent(slug);

  return { id: res.rows[0].id };
};
