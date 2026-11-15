# newworld-helper

Open-source companion for **New World: Aeternum** (planned: [newworld.bergamota.dev](https://newworld.bergamota.dev)). MIT licensed; not affiliated with Amazon Games.

Monorepo: **Nuxt 4** (web) + **NestJS** (API + MCP) + **shared Zod schemas** + versioned JSON under `data/`.

## Requirements

- Node.js 20+
- pnpm 10+ (`corepack enable`)

## Setup

```bash
cp .env.example .env
pnpm install
pnpm build
```

## Development

Terminal 1 (API, port 4000):

```bash
pnpm --filter @newworld-helper/api dev
```

Terminal 2 (web, port 3000, proxies `/api` and `/mcp`):

```bash
API_HOST=127.0.0.1 API_PORT=4000 pnpm --filter @newworld-helper/web dev
```

## Docker (single public port)

```bash
docker compose up --build
```

- **Public URL:** `http://localhost:8080` (override with `PUBLIC_PORT` in `.env`)
- Web proxies `/api/v1/*` and `/mcp` to the Nest API on the same container.

## Environment variables

| Name | Purpose |
| --- | --- |
| `PUBLIC_PORT` | Host port for docker-compose (default `8080`) |
| `API_HOST` | API hostname for Nitro proxy (docker: `127.0.0.1`) |
| `API_PORT` | API listen port (default `4000`) |
| `DATA_DIR` | Path to JSON datasets (default `./data`) |
| `NUXT_PUBLIC_API_BASE` | Browser API prefix (default `/api/v1`) |
| `NODE_ENV` | `development` / `production` |

## API (`/api/v1`)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Liveness |
| GET | `/leveling` | Full NW Leveling export |
| GET | `/leveling/steps/:stepId` | One step (`1`, `6b%20(optional)`, `Daily`, …) |
| GET | `/farming-routes` | `{ meta, routes[] }` (61 routes) |
| GET | `/farming-routes/:id` | One route + file meta |
| GET | `/crafting-recipes` | `{ meta, records[] }` (44 recipes) |
| GET | `/crafting-recipes/:id` | One recipe + meta |
| GET | `/azoth` | Full azoth currency dataset |
| GET | `/azoth/costs/:id` | One cost row + meta |

Data file formats: [`data/README.md`](data/README.md). Crafting calculator logic (next PR): [`docs/crafting/CALC_LOGIC.md`](docs/crafting/CALC_LOGIC.md).

## MCP (read-only, `POST /mcp`)

Streamable HTTP transport (official TypeScript MCP SDK). Tools:

- `get_leveling`, `list_leveling_steps`, `get_leveling_step`
- `get_farming_routes`, `list_farming_routes`, `get_farming_route`
- `get_crafting_recipes`, `list_crafting_recipes`, `get_crafting_recipe`
- `get_azoth`, `list_azoth_costs`, `get_azoth_cost`

## Scripts

```bash
pnpm build      # shared + api + web
pnpm test       # schema + API + MCP smoke tests
pnpm lint
pnpm typecheck
```

## Workspace layout

```
apps/api      NestJS API + MCP
apps/web      Nuxt 4 frontend
packages/shared   Zod schemas + validators
data/         Versioned datasets
docs/crafting/    Calculator spec (not implemented in UI yet)
```