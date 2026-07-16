function parseBoolean(value) {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on", "require"].includes(normalized)) {
    return true;
  }
  if (["0", "false", "no", "off", "disable"].includes(normalized)) {
    return false;
  }

  throw new Error(`Invalid DB_SSL value: ${value}`);
}

export function createPgPoolOptions(databaseUrl, env = process.env) {
  const sslOverride = parseBoolean(env.DB_SSL);
  const url = new URL(databaseUrl);
  const usesSupabase =
    url.hostname.includes("supabase.co") || url.hostname.includes("supabase.com");
  const sslMode = url.searchParams.get("sslmode");
  const shouldUseSsl = sslOverride ?? (usesSupabase || sslMode === "require");
  const max = Number.parseInt(env.DB_POOL_MAX ?? "", 10);

  return {
    connectionString: databaseUrl,
    max: Number.isFinite(max) && max > 0 ? max : 10,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
  };
}
