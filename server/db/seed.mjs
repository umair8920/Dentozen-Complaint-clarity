import bcrypt from "bcryptjs";
import pg from "pg";
import { createPgPoolOptions } from "./connection-options.mjs";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run seeds.");
}

const admin = {
  email: "smartdentalcompliance@gmail.com",
  name: "Smart Dental Compliance Admin",
  password: "Saba@100k#",
  role: "admin",
};

const pool = new pg.Pool(createPgPoolOptions(databaseUrl));
const passwordHash = await bcrypt.hash(admin.password, 12);

await pool.query(
  `insert into users (email, name, password_hash, role)
   values ($1, $2, $3, $4)
   on conflict (email)
   do update set
     name = excluded.name,
     password_hash = excluded.password_hash,
     role = excluded.role,
     updated_at = now()`,
  [admin.email, admin.name, passwordHash, admin.role],
);

await pool.end();

console.log(`Seeded admin user: ${admin.email}`);
