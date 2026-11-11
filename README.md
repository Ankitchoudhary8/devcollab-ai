# DevCollab AI — Project 02

A student project marketplace and team-matching platform. This repository is **Phase 1**: a React + TypeScript dashboard connected to a Node.js + Express API. Project listings are clearly labeled as **sample data**. Accounts, PostgreSQL persistence, GitHub OAuth, AI matching, and chat will be introduced in later phases.

## Tech stack

- Web: React 19, TypeScript, Vite, responsive CSS
- API: Node.js, Express 5, TypeScript, tsx
- Tooling: npm workspaces, GitHub Actions

## Prerequisites

Node.js **22.12+**, npm, VS Code, Git.

## Local setup — Windows PowerShell

Clone and open the repository:

```powershell
git clone https://github.com/Ankitchoudhary8/devcollab-ai.git
cd devcollab-ai
code .
npm install
```

Open two VS Code terminals in the project root:

```powershell
# Terminal 1 — API
npm run dev:api
```

```powershell
# Terminal 2 — frontend
npm run dev:web
```

Visit http://localhost:5173. The API listens on http://localhost:4000, and Vite forwards requests for `/api` to Express. Verify http://localhost:4000/api/health and http://localhost:4000/api/projects.

## Checks

```powershell
npm run typecheck
npm run test
npm run build
```

## Project structure

```text
devcollab-ai/
├── .github/workflows/ci.yml
├── backend/
│   ├── src/app.ts
│   ├── src/server.ts
│   ├── src/data/projects.ts
│   ├── src/routes/projects.ts
│   └── tests/projects.test.ts
├── frontend/
│   ├── src/App.tsx
│   ├── src/App.css
│   ├── src/main.tsx
│   └── vite.config.ts
├── package.json
└── README.md
```

## Phase roadmap

- [x] Phase 1 — Monorepo, React dashboard, Express API, local API proxy, CI configuration
- [ ] Phase 2 — Neon PostgreSQL + Prisma, authentication and protected API
- [ ] Phase 3 — Real project creation, applications and team management
- [ ] Phase 4 — GitHub OAuth and profile/repository integration
- [ ] Phase 5 — Explainable skill matching, optional AI enrichment
- [ ] Phase 6 — Real-time chat, notifications and moderation
- [ ] Phase 7 — Deployment, E2E testing, security and polished portfolio

**Phase 1 includes demo data only and is not production ready.** Do not store real personal data or secrets in source code.
