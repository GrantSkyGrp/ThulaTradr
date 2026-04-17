# PostgreSQL Setup

This project now includes a Prisma schema that mirrors the current local SQLite data model.

## 1. Create a local env file

Create `.env` or `.env.local` in the `thula-platform` root and set:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@127.0.0.1:5432/thula_platform?schema=public"
```

## 2. Generate the Prisma client

```powershell
cmd /c npm run db:generate
```

## 3. Create the schema in PostgreSQL

```powershell
cmd /c npm run db:push
```

For a migration-based workflow instead of direct schema push:

```powershell
cmd /c npm run db:migrate -- --name init
```

## 4. Seed the local database

```powershell
cmd /c npm run db:seed
```

## Current scope

The Prisma schema covers the current app model:

- `users`
- `listings`
- `offers`
- `transactions`
- `invoices`
- `documents`
- `activity_log`
- `verification_documents`
- `listing_update_requests`
- `page_content`
- `contact_requests`
- `lead_requests`
- `partners`
- `site_settings`
- `wallet_transactions`

The runtime is still using the existing local SQLite layer in `src/lib/local-db.ts`.
The next step after schema creation is moving that runtime over to Prisma/PostgreSQL.
