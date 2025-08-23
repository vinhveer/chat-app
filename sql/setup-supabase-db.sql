-- Extensions (an toàn nếu đã tồn tại)
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- =========================
-- Tables
-- =========================

-- Phòng chat (channel hoặc DM)
create table if not exists public.chat_rooms (
  id           uuid primary key default gen_random_uuid(),
  name         text,
  is_direct    boolean not null default false,
  created_by   uuid not null references auth.users(id) on delete restrict,
  created_at   timestamptz not null default now()
);

-- Thành viên phòng
create table if not exists public.chat_room_members (
  room_id      uuid not null references public.chat_rooms(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  joined_at    timestamptz not null default now(),
  primary key (room_id, user_id)
);

-- Tin nhắn
create table if not exists public.chat_messages (
  id           uuid primary key default gen_random_uuid(),
  room_id      uuid not null references public.chat_rooms(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  body         text,                          -- có thể rỗng nếu chỉ có attachment
  created_at   timestamptz not null default now(),
  edited_at    timestamptz,
  deleted_at   timestamptz
);

-- Đính kèm (ảnh/file), tham chiếu Supabase Storage qua file_path
create table if not exists public.chat_attachments (
  id           uuid primary key default gen_random_uuid(),
  message_id   uuid not null references public.chat_messages(id) on delete cascade,
  file_path    text not null,                 -- convention: 'room/<room_uuid>/<filename>'
  mime_type    text,
  size_bytes   bigint,
  created_at   timestamptz not null default now()
);

-- =========================
-- Indexes
-- =========================
create index if not exists chat_room_members_user_idx      on public.chat_room_members (user_id);
create index if not exists chat_messages_room_created_idx  on public.chat_messages (room_id, created_at desc);
create index if not exists chat_messages_user_idx          on public.chat_messages (user_id, created_at desc);
create index if not exists chat_attachments_message_idx    on public.chat_attachments (message_id);

-- =========================
-- RLS enable
-- =========================
alter table public.chat_rooms          enable row level security;
alter table public.chat_room_members   enable row level security;
alter table public.chat_messages       enable row level security;
alter table public.chat_attachments    enable row level security;

-- =========================
-- Helper: kiểm tra user hiện tại có là member của room không
-- =========================
create or replace function public.chat_is_member(_room uuid)
returns boolean
language sql stable as $$
  select exists (
    select 1 from public.chat_room_members
    where room_id = _room and user_id = auth.uid()
  );
$$;

-- =========================
-- Policies (drop nếu tồn tại để tránh trùng)
-- =========================
drop policy if exists "chat_rooms: select if member"        on public.chat_rooms;
drop policy if exists "chat_rooms: insert by creator"       on public.chat_rooms;
drop policy if exists "chat_room_members: select if same room" on public.chat_room_members;
drop policy if exists "chat_room_members: insert self or by creator" on public.chat_room_members;
drop policy if exists "chat_messages: select if member"     on public.chat_messages;
drop policy if exists "chat_messages: insert if member (self)" on public.chat_messages;
drop policy if exists "chat_messages: update own"           on public.chat_messages;
drop policy if exists "chat_messages: delete own"           on public.chat_messages;
drop policy if exists "chat_attachments: select if member of message's room" on public.chat_attachments;
drop policy if exists "chat_attachments: insert if author of message"        on public.chat_attachments;

-- ROOMS
create policy "chat_rooms: select if member"
on public.chat_rooms
for select to authenticated
using (public.chat_is_member(id));

create policy "chat_rooms: insert by creator"
on public.chat_rooms
for insert to authenticated
with check (created_by = auth.uid());

-- ROOM_MEMBERS
create policy "chat_room_members: select if same room"
on public.chat_room_members
for select to authenticated
using (public.chat_is_member(room_id));

-- Cho phép creator tự thêm mình ngay khi tạo room (thành viên khác nên thêm qua server với service role)
create policy "chat_room_members: insert self or by creator"
on public.chat_room_members
for insert to authenticated
with check (
  -- tự join vào room nếu chính mình là creator
  (auth.uid() = user_id and auth.uid() = (select created_by from public.chat_rooms where id = room_id))
);

-- MESSAGES
create policy "chat_messages: select if member"
on public.chat_messages
for select to authenticated
using (public.chat_is_member(room_id));

create policy "chat_messages: insert if member (self)"
on public.chat_messages
for insert to authenticated
with check (public.chat_is_member(room_id) and user_id = auth.uid());

create policy "chat_messages: update own"
on public.chat_messages
for update to authenticated
using (user_id = auth.uid());

create policy "chat_messages: delete own"
on public.chat_messages
for delete to authenticated
using (user_id = auth.uid());

-- ATTACHMENTS
create policy "chat_attachments: select if member of message's room"
on public.chat_attachments
for select to authenticated
using (
  exists (
    select 1
    from public.chat_messages m
    where m.id = message_id and public.chat_is_member(m.room_id)
  )
);

create policy "chat_attachments: insert if author of message"
on public.chat_attachments
for insert to authenticated
with check (
  exists (
    select 1
    from public.chat_messages m
    where m.id = message_id and m.user_id = auth.uid()
  )
);

-- =========================
-- STORAGE POLICIES (Bucket: chat-uploads, private)
-- file_path: 'room/<room_uuid>/<filename>'
-- =========================
create or replace function public.chat_room_from_path(path text)
returns uuid
language sql immutable as $$
  -- 'room/<room_uuid>/<filename>' -> lấy phần thứ 2, cast uuid
  select nullif(split_part(path, '/', 2), '')::uuid;
$$;

-- Drop cũ nếu có
drop policy if exists "storage: read if member of room"   on storage.objects;
drop policy if exists "storage: insert if member of room" on storage.objects;
drop policy if exists "storage: delete if member of room" on storage.objects;

-- READ
create policy "storage: read if member of room"
on storage.objects
for select to authenticated
using (
  bucket_id = 'chat-uploads'
  and public.chat_is_member(public.chat_room_from_path(name))
);

-- WRITE
create policy "storage: insert if member of room"
on storage.objects
for insert to authenticated
with check (
  bucket_id = 'chat-uploads'
  and public.chat_is_member(public.chat_room_from_path(name))
);

-- DELETE
create policy "storage: delete if member of room"
on storage.objects
for delete to authenticated
using (
  bucket_id = 'chat-uploads'
  and public.chat_is_member(public.chat_room_from_path(name))
);

-- =========================
-- Realtime: đảm bảo đầy đủ dữ liệu thay đổi & add vào publication
-- =========================
alter table public.chat_rooms        replica identity full;
alter table public.chat_room_members replica identity full;
alter table public.chat_messages     replica identity full;
alter table public.chat_attachments  replica identity full;

do $$
begin
  begin
    alter publication supabase_realtime add table public.chat_rooms;
  exception when others then
    if sqlstate <> '42710' then raise; end if; -- 42710: already in publication
  end;
  begin
    alter publication supabase_realtime add table public.chat_room_members;
  exception when others then
    if sqlstate <> '42710' then raise; end if;
  end;
  begin
    alter publication supabase_realtime add table public.chat_messages;
  exception when others then
    if sqlstate <> '42710' then raise; end if;
  end;
  begin
    alter publication supabase_realtime add table public.chat_attachments;
  exception when others then
    if sqlstate <> '42710' then raise; end if;
  end;
end$$;

-- (tùy chọn) đảm bảo role authenticated có quyền dùng schema public
grant usage on schema public to authenticated;
