/**
 * Phase 2: verify both private Neon URLs without revealing credentials.
 * Uses read-only PostgreSQL transactions: no CREATE, INSERT, UPDATE or migrations.
 * Run from backend: node scripts/verify-neon.mjs
 */
import { config } from "dotenv";
import pg from "pg";

config({ path: new URL("../.env", import.meta.url), quiet: true });

const EXPECTED_DATABASE = "devcollab";
const EXPECTED_ROLE = "devcollab_owner";

// Public (non-secret) endpoint hostnames verified against the DevCollab AI
// project, branch "development". Pinning them prevents accidental checks of
// Expense Tracker Pro or another Neon database.
const ENDPOINTS = [
  {
    key: "DIRECT_URL",
    type: "direct",
    host: "ep-damp-credit-b3y8f0ky.c-4.ap-southeast-1.aws.neon.tech",
  },
  {
    key: "DATABASE_URL",
    type: "pooled",
    host: "ep-damp-credit-b3y8f0ky-pooler.c-4.ap-southeast-1.aws.neon.tech",
  },
];

async function verify({ key, type, host }) {
  const secret = process.env[key];
  if (!secret) {
    console.error(`${key}: missing in backend/.env.`);
    return false;
  }

  let parsed;
  try {
    parsed = new URL(secret);
  } catch {
    console.error(`${key}: invalid PostgreSQL connection URL.`);
    return false;
  }

  if (
    !["postgres:", "postgresql:"].includes(parsed.protocol) ||
    parsed.hostname.toLowerCase() !== host ||
    decodeURIComponent(parsed.pathname) !== `/${EXPECTED_DATABASE}` ||
    decodeURIComponent(parsed.username) !== EXPECTED_ROLE
  ) {
    console.error(
      `${key}: wrong Neon endpoint, database, or role. Check project DevCollab AI / development / devcollab; do not paste URLs here.`,
    );
    return false;
  }

  const client = new pg.Client({
    connectionString: secret,
    connectionTimeoutMillis: 12000,
    query_timeout: 12000,
  });

  try {
    await client.connect();
    await client.query("BEGIN READ ONLY");
    const result = await client.query(
      "SELECT current_database() AS db_name, current_user AS role_name, current_schema() AS schema_name, current_setting('transaction_read_only') AS read_only",
    );
    await client.query("ROLLBACK");

    const found = result.rows[0];
    if (
      found?.db_name !== EXPECTED_DATABASE ||
      found?.role_name !== EXPECTED_ROLE ||
      found?.read_only !== "on"
    ) {
      console.error(`${key}: connected to an unexpected database or role.`);
      return false;
    }
    console.log(
      `${key} (${type}): OK — database=${EXPECTED_DATABASE}; role=${EXPECTED_ROLE}; read-only query succeeded.`,
    );
    return true;
  } catch (err) {
    // Log only a safe error code, NOT an error message or secret URL.
    const code = typeof err?.code === "string" ? err.code : "unavailable";
    console.error(`${key}: connection/query failed (code: ${code}).`);
    return false;
  } finally {
    try {
      await client.end();
    } catch {
      // No-op on an already closed connection.
    }
  }
}

let allPassed = true;
for (const endpoint of ENDPOINTS) {
  const passed = await verify(endpoint);
  if (!passed) allPassed = false;
}
if (allPassed) {
  console.log("DevCollab AI Neon connection verification passed. No tables were changed.");
} else {
  console.error("Verification incomplete. No tables were changed.");
  process.exitCode = 1;
}
