import pg from "pg";

import { requireEnv } from "../config/env";
import { createPgPoolOptions } from "./connection-options";

let pool: pg.Pool | undefined;

export function getPool() {
  if (!pool) {
    pool = new pg.Pool(createPgPoolOptions(requireEnv("databaseUrl")));
  }

  return pool;
}

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  return getPool().query<T>(text, params);
}
