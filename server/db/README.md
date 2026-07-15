# Database setup

This app uses PostgreSQL through `pg`.

## Local development

Keep `.env` pointed at your local PostgreSQL database:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/compliant_clarity
DB_SSL=false
```

Run local migrations and seeds:

```bash
npm run db:migrate:local
npm run db:seed:local
```

## Supabase production

Use `.env.example` as the single template. For deployed environments, set `DATABASE_URL` to the Supabase **Session Pooler** connection string for project `hsquitmxbeeznraphkic`.

```env
DATABASE_URL=postgresql://postgres.hsquitmxbeeznraphkic:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
DB_SSL=true
```

Use the pooler URL for deployed Node hosts. Supabase direct database URLs such as `db.hsquitmxbeeznraphkic.supabase.co` can resolve over IPv6 by default; some hosting providers do not support that path. Supabase Dashboard > Connect > Session pooler gives the IPv4-compatible Supavisor URL.

Run production migrations against Supabase:

```bash
npm run db:migrate:production
```

Only run the production seed command when you intentionally want to upsert the admin user in Supabase:

```bash
npm run db:seed:production
```

In production hosting, set the same environment variables directly in the host dashboard. The app chooses the database entirely from `DATABASE_URL`, so local development and production stay separate.
