# Dataset files

JSON datasets for the New World: Aeternum companion. Each file is validated at API startup with Zod schemas in `@newworld-helper/shared`.

## Files

| File | Shape | API |
| --- | --- | --- |
| `leveling.json` | NW Leveling export (+ `map_note`, `materials[]`, `map_path` per step) | `GET /api/v1/leveling`, `GET /api/v1/leveling/steps/:stepId` |
| `farming-routes.json` | `{ meta, routes[] }` community gathering routes | `GET /api/v1/farming-routes`, `GET /api/v1/farming-routes/:id` |
| `crafting-recipes.json` | JSON **array** of 44 recipes (nwdb) | `GET /api/v1/crafting-recipes`, `GET /api/v1/crafting-recipes/:id` |
| `azoth.json` | Azoth currency research export | `GET /api/v1/azoth`, `GET /api/v1/azoth/costs/:id` |
| `azoth/README.md` | Human docs for the azoth dataset | — |

Crafting calculator logic for a future UI lives in `docs/crafting/CALC_LOGIC.md` (not embedded in the JSON).

## Leveling (`leveling.json`)

Each step has `step` (number or string), nullable `level_min` / `level_max`, `map_path`, `sources[]` with `{ url, title, date, patch }`. Top-level `map_note` and `materials[]` (34 items in the current snapshot).

## Farming routes (`farming-routes.json`)

```json
{
  "meta": { "generated", "game", "patch", "notes": [] },
  "routes": [
    {
      "id", "name", "region", "materials", "tier",
      "waypoints": [{ "name", "x", "y", "contents" }],
      "respawn", "node_count", "loop_time", "tradeskill_req", "tool_tier",
      "danger", "nearest_town", "zone_level", "patch_notes", "sources", "notes"
    }
  ]
}
```

`x` and `y` are **null** until a public coordinate source is wired in. Do not invent map positions.

## Crafting recipes (`crafting-recipes.json`)

Top-level array of recipes:

```json
{
  "id": "iron_ingot",
  "name": "Iron Ingot",
  "tradeskill": "Smelting",
  "ingredients": [
    { "item", "item_id", "qty", "accepts_category" }
  ],
  "source": {
    "url",
    "nwdb_recipe_id",
    "accessed",
    "patch"
  }
}
```

Use explicit `null` for unknown scalars.

## Azoth (`azoth.json`)

```json
{
  "meta": { "generated_at", "currency_cap", "cap_source", "notes", "scope" },
  "costs": [],
  "earn": [],
  "caps": [],
  "spend_tips": [],
  "azoth_staff": {},
  "project_azoth_server": {}
}
```

Cost rows include `source_url`, nullable `source_date`, `confidence` (`confirmed` | `likely` | `estimate` | `unknown`), and `outdated_risk`. Unknown amounts are `null` (never use `0` as a stand-in for unknown).

See `data/azoth/README.md` for interpretation notes.

## Workflow

1. Add or edit JSON under `data/`.
2. Restart the API (or rebuild containers).
3. Confirm via REST or MCP read-only tools.

Invalid files prevent the API from starting.