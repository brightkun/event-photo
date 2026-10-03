create table if not exists users (
  id serial primary key,
  name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table users enable row level security;

create table if not exists events (
  id serial primary key,
  slug text not null unique,
  name text not null,
  date date not null,
  location text not null,
  created_at timestamptz not null default now()
);

-- Владелец события. У старых событий его нет (null), их видит только admin.
alter table events add column if not exists user_id integer references users(id) on delete set null;

create index if not exists events_user_id_idx on events (user_id, created_at desc);

create table if not exists guests (
  id serial primary key,
  event_id integer not null references events(id) on delete cascade,
  name text not null,
  token text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists photos (
  id serial primary key,
  event_id integer not null references events(id) on delete cascade,
  guest_id integer not null references guests(id) on delete cascade,
  path text not null,
  width integer not null,
  height integer not null,
  created_at timestamptz not null default now()
);

create index if not exists photos_event_id_idx on photos (event_id, created_at desc);

create table if not exists reactions (
  id serial primary key,
  photo_id integer not null references photos(id) on delete cascade,
  guest_id integer not null references guests(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (photo_id, guest_id, emoji)
);

create table if not exists comments (
  id serial primary key,
  photo_id integer not null references photos(id) on delete cascade,
  guest_id integer not null references guests(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_photo_id_idx on comments (photo_id, created_at);
