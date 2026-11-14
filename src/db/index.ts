import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Supabase Connection URL securely loaded from the environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("⚠️ DATABASE_URL is not defined! To transition fully out of offline mock, configure this in your .env file.");
}

// Instantiate the Postgres connection safely. Disable prepare for Supabase Transaction Pooler (PgBouncer compatibility)
export const client = connectionString ? postgres(connectionString, { prepare: false }) : null;

// The global Drizzle database access object mapped securely to our engineered schema
export const db = client ? drizzle(client, { schema }) : null;
