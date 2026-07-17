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

const logbooks = [
  {
    id: "log-reception",
    title: "Reception Logbook",
    order: 10,
    gradient: "gradient-teal-purple",
  },
  {
    id: "log-nurse",
    title: "Dental Nurse Logbook",
    order: 20,
    gradient: "gradient-purple-orange",
  },
  {
    id: "log-lead-nurse",
    title: "Lead Nurse Logbook",
    order: 30,
    gradient: "gradient-orange-gold",
  },
  {
    id: "log-manager",
    title: "Practice Manager Logbook",
    order: 40,
    gradient: "gradient-blue-teal",
  },
];

for (const logbook of logbooks) {
  await pool.query(
    `insert into admin_service_items
      (section, content_key, title, description, price, status, display_order, metadata)
     values ('resources', $1, $2, '', 49.99, 'active', $3, $4::jsonb)
     on conflict (section, content_key) where content_key is not null do nothing`,
    [
      logbook.id,
      logbook.title,
      logbook.order,
      JSON.stringify({
        itemId: logbook.id,
        resourceType: "logbook",
        allowQuantity: true,
        gradient: logbook.gradient,
      }),
    ],
  );
}

await pool.end();

console.log(`Seeded admin user: ${admin.email}`);
console.log(`Seeded ${logbooks.length} compliance logbooks when missing.`);
