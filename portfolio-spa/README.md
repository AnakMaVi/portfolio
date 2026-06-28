# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Contact Form (Serverless Email)

The contact section is integrated with Formspree using a frontend-only serverless flow.

### Setup

1. Create a form in Formspree and copy your endpoint URL.
2. Create a `.env` file in the project root.
3. Add the variable:

```env
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/TU_FORM_ID
```

4. Restart the dev server after editing `.env`.

### Notes

- Contact messages are routed to `anakmartelviera@gmail.com` when Formspree is configured correctly.
- The sender shown by email providers may be the Formspree relay address due to anti-spoofing policies.
- The form still passes the visitor email as `_replyto` so you can answer directly.

## Supabase (Cloud Database)

The contact section can save messages directly into Supabase. If Supabase is configured, it is used first.
If Supabase is not configured, the form falls back to Formspree.

### 1) Create project and collect keys

In Supabase Dashboard:

1. Create a new project.
2. Copy your `Project URL` and `anon public key` from Settings > API.

### 2) Create table

Run this SQL in Supabase SQL Editor:

```sql
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
```

### 3) Enable Row Level Security and policy

```sql
alter table public.contact_messages enable row level security;

drop policy if exists "public_insert_contact_messages" on public.contact_messages;

create policy "public_insert_contact_messages"
on public.contact_messages
for insert
to anon
with check (true);
```

Optional (recommended): keep `select` blocked for `anon` so public visitors cannot read messages.

### 4) Configure environment

Set these values in `.env`:

```env
VITE_SUPABASE_URL=https://TU_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=TU_SUPABASE_ANON_KEY
VITE_SUPABASE_CONTACTS_TABLE=contact_messages
```

Restart Vite after editing `.env`.
