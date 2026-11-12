/**
 * Populate backend/.env from the correct Neon project without printing secrets.
 *
 * Prerequisites (Windows PowerShell):
 *   npm.cmd install --global neon@latest
 *   neon.cmd auth
 *
 * From devcollab-ai/backend:
 *   node scripts/sync-neon-env.mjs
 *
 * Never run this against Expense Tracker Pro. No migrations or writes to Neon.
 */
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const backend = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(backend, "..");
const envPath = resolve(backend, ".env");

const projectId = "ancient-violet-01820807";
const branchId = "br-bold-darkness-b3dkmlen";
const database = "devcollab";
const role = "devcollab_owner";
const hostDirect = "ep-damp-credit-b3y8f0ky.c-4.ap-southeast-1.aws.neon.tech";
const hostPooled = "ep-damp-credit-b3y8f0ky-pooler.c-4.ap-southeast-1.aws.neon.tech";

const onWindows = process.platform === "win32";
const neonBinary = onWindows ? "neon.cmd" : "neon";
const gitBinary = onWindows ? "git.exe" : "git";

function stop(message) {
  console.error(message);
  process.exit(1);
}

function run(binary, args, opts = {}) {
  return spawnSync(binary, args, {
    cwd: backend,
    encoding: "utf8",
    shell: onWindows && binary === neonBinary,
    timeout: 60000,
    maxBuffer: 1024 * 1024,
    windowsHide: true,
    ...opts,
  });
}

const ignored = spawnSync(gitBinary, ["check-ignore", "-q", "--", "backend/.env"], {
  cwd: repoRoot,
  encoding: "utf8",
  windowsHide: true,
});
if (ignored.status !== 0) {
  stop("Safety check failed: backend/.env is not ignored by Git. No changes made.");
}

function getUrl({ pooled, hostname, key }) {
  const args = [
    "connection-string",
    branchId,
    "--project-id", projectId,
    "--database-name", database,
    "--role-name", role,
    ...(pooled ? ["--pooled"] : []),
  ];

  // Capture stdout/stderr in memory. Never print it: it may contain credentials.
  const response = run(neonBinary, args);
  if (response.error || response.status !== 0 || !response.stdout) {
    stop(
      "Neon CLI could not fetch " + key +
      ". Ensure Neon CLI is installed and signed in to the account owning DevCollab AI (run neon.cmd auth). No changes made.",
    );
  }

  const secret = response.stdout.trim();
  let parsed;
  try {
    parsed = new URL(secret);
  } catch {
    stop("Neon CLI did not return a usable " + key + ". No changes made.");
  }

  if (
    !["postgres:", "postgresql:"].includes(parsed.protocol) ||
    parsed.hostname.toLowerCase() !== hostname ||
    decodeURIComponent(parsed.username) !== role ||
    decodeURIComponent(parsed.pathname) !== "/" + database ||
    !parsed.password ||
    parsed.searchParams.get("sslmode") !== "require"
  ) {
    stop(
      "Safety check failed for " + key +
      ": CLI returned an unexpected project/branch/database/role or security setting. No changes made.",
    );
  }

  return secret;
}

console.log("Contacting Neon for DevCollab AI / development / devcollab...");
const direct = getUrl({ pooled: false, hostname: hostDirect, key: "DIRECT_URL" });
const pooled = getUrl({ pooled: true, hostname: hostPooled, key: "DATABASE_URL" });

// Keep any unrelated local .env entries; update only these two keys.
const original = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
const newline = original.includes("\r\n") ? "\r\n" : "\n";
const lines = original.split(/\r?\n/);
const seen = new Set();
const replacements = new Map([
  ["DIRECT_URL", direct],
  ["DATABASE_URL", pooled],
]);
const rewritten = [];
for (const line of lines) {
  const match = line.match(/^\s*(DIRECT_URL|DATABASE_URL)\s*=/);
  if (!match) {
    rewritten.push(line);
    continue;
  }
  const key = match[1];
  if (!seen.has(key)) {
    rewritten.push(key + '="' + replacements.get(key) + '"');
    seen.add(key);
  }
}
for (const [key, value] of replacements) {
  if (!seen.has(key)) rewritten.push(key + '="' + value + '"');
}
while (rewritten.length && rewritten[rewritten.length - 1] === "") {
  rewritten.pop();
}
writeFileSync(envPath, rewritten.join(newline) + newline, { mode: 0o600 });
console.log("Saved DIRECT_URL and DATABASE_URL locally in ignored backend/.env (secrets not shown).");
console.log("Running read-only connection verification...");

const check = spawnSync(
  process.execPath,
  [resolve(backend, "scripts", "verify-neon.mjs")],
  { cwd: backend, stdio: "inherit", windowsHide: true },
);
if (check.status !== 0) {
  process.exitCode = 1;
}
