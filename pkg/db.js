import { neon } from "@neondatabase/serverless";

let client = null;

export default function getDb() {
  if (!client) client = neon(process.env.DATABASE_URL || "");
  return client;
}

