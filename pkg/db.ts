import { neon } from "@neondatabase/serverless";

let client: ReturnType<typeof neon> | null = null;

export function getDb() {
  if (!client) client = neon(process.env.DATABASE_URL || "");
  return client;
}

export default getDb;
