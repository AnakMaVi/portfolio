create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  nombre text not null,
  email text not null,
  asunto text not null,
  mensaje text not null,
  destino_email text,
  source text default 'portfolio-web',
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "public_insert_contact_messages" on public.contact_messages;

create policy "public_insert_contact_messages"
on public.contact_messages
for insert
to anon
with check (true);
