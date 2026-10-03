import { pool } from "../plugins/pg";

export const getStatsService = async () => {
  const res = await pool.query(`
    select
      (select count(*)::int from users) as users_count,
      (select count(*)::int from events) as events_count,
      (select count(*)::int from photos) as photos_count,
      (select count(*)::int from comments) as comments_count
  `);

  return res.rows[0];
};

export const getAllEventsService = async () => {
  const res = await pool.query(`
    select
      e.id, e.slug, e.name, to_char(e.date, 'YYYY-MM-DD') as date, e.location, e.created_at,
      u.name as owner_name, u.email as owner_email,
      (select count(*)::int from photos where event_id = e.id) as photos_count,
      (select count(*)::int from guests where event_id = e.id) as guests_count
    from events e
    left join users u on u.id = e.user_id
    order by e.created_at desc, e.id desc
  `);

  return res.rows;
};

export const getUsersService = async () => {
  const res = await pool.query(`
    select
      u.id, u.name, u.email, u.role, u.created_at,
      (select count(*)::int from events where user_id = u.id) as events_count
    from users u
    order by u.created_at desc, u.id desc
  `);

  return res.rows;
};
