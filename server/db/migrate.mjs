import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { createPgPoolOptions } from "./connection-options.mjs";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run migrations.");
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, "migrations");
const pool = new pg.Pool(createPgPoolOptions(databaseUrl));

await pool.query(`
  create table if not exists schema_migrations (
    id text primary key,
    applied_at timestamptz not null default now()
  )
`);

const files = (await fs.readdir(migrationsDir)).filter((file) => file.endsWith(".sql")).sort();

for (const file of files) {
  const applied = await pool.query("select 1 from schema_migrations where id = $1", [file]);
  if (applied.rowCount) {
    console.log(`Skipping ${file}`);
    continue;
  }

  const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");
  const client = await pool.connect();
  try {
    await client.query("begin");
    await client.query(sql);
    await client.query("insert into schema_migrations (id) values ($1)", [file]);
    await client.query("commit");
    console.log(`Applied ${file}`);
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

await pool.end();
