# Phase 2 — PostgreSQL and Prisma ORM (schema stage)

> Status: **Schema prepared, not yet migrated.** This branch does not modify the live Phase 1 dashboard or Express API.

## Database isolation

Neon project: `DevCollab AI` (a completely different project from `Expense Tracker Pro`).

- Branch: `development`
- Database: `devcollab`
- Role: `devcollab_owner`
- Never use the Expense Tracker Pro database credentials here.

## Step 1: Switch from Phase 1 to the feature branch

From `C:\Users\ANKIT\devcollab-ai` in VS Code PowerShell, after stopping local dev servers:

```powershell
git status --short
git fetch origin
git switch feature/phase2-prisma-schema
```

If the branch isn't present locally, use `git switch -c feature/phase2-prisma-schema --track origin/feature/phase2-prisma-schema`.

## Step 2: Install Prisma 7 (Node.js 22.12+)

From the repository root:

```powershell
npm.cmd install --save-dev prisma@7 dotenv --workspace backend
npm.cmd install @prisma/client@7 @prisma/adapter-pg@7 pg --workspace backend
```

We deliberately use the same major version for the Prisma CLI, client, and Postgres adapter. The npm workspace installs packages into the existing monorepo and updates `package-lock.json`.

## Step 3: Validate schema without writing any database tables

From the repository root:

```powershell
cd backend
npx.cmd prisma validate
cd ..
```

The schema has seven models: User, Skill, UserSkill, Project, ProjectSkill, ProjectApplication, and ProjectMember.

**Validation only checks the Prisma definitions. It does not run a migration.**

## Step 4: Private connection settings (later, before migration)

Create `backend/.env` from `backend/.env.example` and insert credentials copied **privately** from the DevCollab AI project in Neon:

- `DATABASE_URL`: pooled connection string for application traffic.
- `DIRECT_URL`: direct, non-pooled connection string for migrations.
- Verify the branch is `development` and the database is exactly `devcollab`.

The real `.env` is ignored by Git. Never paste connection strings in chats or screenshots.

## Step 5: Review migration, then apply (separate step)

We will inspect and review the generated SQL **before** running `prisma migrate dev`. No migrations are generated or applied by this change.

## Model design

| Model | Purpose |
| --- | --- |
| User | Accounts, credentials hash placeholder, profile, GitHub identity |
| Skill | Canonical skill names |
| UserSkill | User-to-skill relation |
| Project | Projects owned by one user |
| ProjectSkill | Skills needed by each project |
| ProjectApplication | One application per student per project |
| ProjectMember | Explicit project membership and role |

Privacy and security features such as password hashing, validated role transitions, ownership permissions, and OAuth flow are **not implemented by this schema alone**; those belong to later Phase 2 implementation steps.

## Git workflow

Work on `feature/phase2-prisma-schema`. Do not merge this branch into `main` until schema validation and migration tests pass.

The existing Phase 1 dashboard continues to use sample projects in memory.
