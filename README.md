# Richemont Learning Recommendations

Modern responsive prototype for an internal Richemont learning recommendation platform.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- Supabase database-only integration
- Recharts
- Lucide icons

## Demo Credentials

- Learning manager
  - `manager@richemont.com`
  - `admin123`
- Employee
  - `employee@richemont.com`
  - `employee123`

## Supabase Setup

Run the SQL files in `supabase/` against your project:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

If you want the login route to query Supabase instead of the local mock fallback, set:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Local Development

```bash
pnpm install
pnpm dev
```
