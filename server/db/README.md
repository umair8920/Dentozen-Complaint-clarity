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

Create `.env.production` from `.env.production.example`, then set `DATABASE_URL` to the Supabase Postgres connection string for project `hsquitmxbeeznraphkic`.

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.hsquitmxbeeznraphkic.supabase.co:5432/postgres
DB_SSL=true
```

Run production migrations against Supabase:

```bash
npm run db:migrate:production
```

Only run the production seed command when you intentionally want to upsert the admin user in Supabase:

```bash
npm run db:seed:production
```

In production hosting, set the same environment variables directly in the host dashboard. The app chooses the database entirely from `DATABASE_URL`, so local development and production stay separate.
