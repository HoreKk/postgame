# Postgame

**Postgame** is a Letterboxd-style platform for esports — track, review, and discover competitive matches. The MVP focuses on **League of Legends** using the unofficial LoL Esports API.

---

## Architecture

Turborepo monorepo with a single fullstack app and shared packages.

```
postgame/
├── apps/
│   └── web/              # React 19 + TanStack Start (SSR) + Chakra UI
└── packages/
    ├── lol-client/       # Auto-generated LoL Esports API client (hey-api)
    ├── api/              # oRPC procedures (business logic, calls lol-client)
    ├── auth/             # Better-Auth configuration
    ├── db/               # Drizzle ORM schema + PostgreSQL
    └── config/           # Shared config
```

### `packages/lol-client`

Fully typed client generated from the [unofficial LoL Esports OpenAPI spec](https://github.com/vickz84259/lolesports-api-docs) using **[hey-api](https://heyapi.dev/)** (`@hey-api/openapi-ts`).

Regenerate the client:

```bash
cd packages/lol-client
pnpm run generate   # fetches OpenAPI YAML and regenerates src/client/
```

Outputs: typed SDK functions, TanStack Query hooks, JSON schemas, and response transformers — all in `src/client/`.

### `packages/api`

oRPC router that exposes type-safe procedures to the web app. Consumes `lol-client` to fetch leagues, schedules, events, and standings. Extracts dominant team colors from images via `colorthief`.

### `apps/web`

TanStack Start (Vite + Nitro SSR) app. Uses TanStack Router (file-based), TanStack Query, and connects to the API layer via oRPC client.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start + Nitro |
| UI | React 19 + Chakra UI |
| Routing | TanStack Router (file-based) |
| Data fetching | TanStack Query + oRPC |
| API | oRPC (end-to-end type-safe RPC) |
| Auth | Better-Auth (email/password) |
| Database | PostgreSQL + Drizzle ORM |
| LoL API client | hey-api (OpenAPI → TypeScript) |
| Monorepo | Turborepo + pnpm |
| Linting | Oxlint + Oxfmt |

---

## Getting Started

**Prerequisites:** Node.js, pnpm, Docker (for local PostgreSQL)

```bash
pnpm install
```

### Environment

Copy and fill in the env file:

```bash
cp apps/web/.env.example apps/web/.env
```

Required variables: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `LOL_API_KEY`

> The `LOL_API_KEY` is the API key for `https://esports-api.lolesports.com`.

### Database

```bash
pnpm run db:start   # start PostgreSQL via Docker
pnpm run db:push    # apply schema
```

### Dev server

```bash
pnpm run dev        # starts web app on http://localhost:3000
```

---

## Scripts

| Command | Description |
|---|---|
| `pnpm run dev` | Start dev server |
| `pnpm run build` | Build all packages and apps |
| `pnpm run check-types` | TypeScript type check |
| `pnpm run check` | Lint + format (Oxlint/Oxfmt) |
| `pnpm run db:start` | Start Docker PostgreSQL |
| `pnpm run db:push` | Push Drizzle schema to DB |
| `pnpm run db:studio` | Open Drizzle Studio |
| `pnpm run db:generate` | Generate Drizzle types |
