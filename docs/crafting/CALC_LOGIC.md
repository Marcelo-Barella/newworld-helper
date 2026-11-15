# NW Crafting sheet: calculator logic

Source: Google Sheet "NW Crafting – Tradeskill Plan", Calculator tab (mirrors `recipes.json`).
Recipe data: nwdb.info, data version LIVE 11/04/2025 (Season 10, post-Aeternum). Accessed 2026-11-15.

## Inputs
- `target` (one recipe id) and `qty` (integer > 0).
- `have[item_id]`: optional on-hand count for ANY material (target, intermediate, raw or reagent).

## Expansion (full depth, no fixed recursion limit)
1. Materials are processed in topological order: every parent comes before its ingredients. The sheet uses a fixed list (Recipes!L2:L66): target items, then refined items from highest to lowest tier (Charcoal last), then raws/reagents. The chains go up to 5 levels deep, e.g. Mythril Ingot → Orichalcum → Starmetal → Steel → Iron Ingot → Iron Ore. They are expanded all the way down to raw materials.
2. For each material `m` in that order:
   - `gross_need[m] = (m == target ? qty : 0) + Σ over already-processed parents p that use m: ingredient_qty(p, m) × crafts[p]`
   - `still_need[m] = max(0, gross_need[m] − have[m])`
   - If `m` has a recipe: `crafts[m] = ceil(still_need[m] / output_qty[m])`. Children are driven by **crafts**, not raw need, so rounding up applies at every level. Every `output_qty` is currently 1, so the ceiling is a no-op today, but keep it.
   - If `m` is raw/reagent: it is a leaf, and the amount to gather/buy is `still_need[m]`.
3. `have` is subtracted at each node BEFORE expanding. Having 40 Iron Ingot reduces Iron Ingot crafts by 40 and Iron Ore by 160.

## XP
- `batch_xp = Σ over all recipe nodes: crafts[m] × xp[m]`. This includes the target and every intermediate refining craft (Smelting, Woodworking, Leatherworking, Charcoal…). XP is credited to each recipe's own `tradeskill`.
- Also shown separately: target-only XP = `crafts[target] × xp[target]`.
- XP is base `recipeExp` from nwdb. NOT modeled: first-craft bonus, XP boosts/buffs/events, gear, and fort/faction buffs.

## Ignored / simplifications
- **Refining bonus yield / crit-craft variance is ignored.** `output_qty` is the base output. Real refining yields more, so raw totals are an upper bound.
- **Category ingredients** (e.g. "Tier 2 Metals", "Refined Wood", "Leathers", "Wood", "Hide Tier 5", "Tier 5 Ingot (Rare)") use ONE default item, given in `item_id`. The category name is in `accepts_category`. Defaults: the same-tier ingot/plank/leather; Green Wood for Charcoal; Iron Hide for Hide Tier 5; Mythril Ingot for Tier 5 Ingot (Rare). Alternatives (Fae Iron, Voidmetal, Prismatic, other woods, etc.) are not expanded.
- No cost or Trading Post prices. Reagents are treated as leaves (buy/salvage/loot/converter).
- No cycles exist in this data set.

## Test vectors (sheet and an independent Python re-implementation agree)
| Target × qty | have | Expected leaves | batch_xp | target xp |
|---|---|---|---|---|
| iron_hatchet × 1 | – | iron_ore 28, green_wood 8, rawhide 4 (intermediates: iron_ingot 7, timber 2, coarse_leather 1) | 700 | 260 |
| steel_hatchet × 10 | – | iron_ore 960, aged_wood 80, green_wood 480, rawhide 160, obsidian_flux 80, obsidian_sandpaper 20, aged_tannin 10 | 58,100 | 9,680 |
| steel_hatchet × 10 | iron_ingot 40 | iron_ingot crafts 200, iron_ore 800 (everything else as above) | – | – |

## Raw materials / reagents (leaves; no record in recipes.json)
| Name | item_id | Type | From |
|---|---|---|---|
| Iron Ore | `iron_ore` | Raw | Mining |
| Starmetal Ore | `starmetal_ore` | Raw | Mining |
| Orichalcum Ore | `orichalcum_ore` | Raw | Mining |
| Mythril Ore | `mythril_ore` | Raw | Mining |
| Green Wood | `green_wood` | Raw | Logging |
| Aged Wood | `aged_wood` | Raw | Logging |
| Wyrdwood | `wyrdwood` | Raw | Logging |
| Ironwood | `ironwood` | Raw | Logging |
| Runewood | `runewood` | Raw | Logging |
| Rawhide | `rawhide` | Raw | Skinning |
| Thick Hide | `thick_hide` | Raw | Skinning |
| Iron Hide | `iron_hide` | Raw | Skinning |
| Dark Hide | `dark_hide` | Raw | Skinning |
| Fibers | `fibers` | Raw | Harvesting |
| Silk Threads | `silk_threads` | Raw | Harvesting |
| Wirefiber | `wirefiber` | Raw | Harvesting |
| Flint | `flint` | Raw | Pick up (no tool) |
| Obsidian Flux | `obsidian_flux` | Reagent | TP / salvage / loot / reagent converter |
| Obsidian Sandpaper | `obsidian_sandpaper` | Reagent | TP / salvage / loot / reagent converter |
| Aged Tannin | `aged_tannin` | Reagent | TP / salvage / loot / reagent converter |
| Wireweave | `wireweave` | Reagent | TP / salvage / loot / reagent converter |

## Notes on recipes.json fields
- `id` / `item_id`: snake_case slug of the English name (not the nwdb id). The nwdb recipe id is in `source.nwdb_recipe_id`, and the URL is `https://nwdb.info/db/recipe/<id>`.
- `station_tier` is the minimum station tier nwdb lists. Flint Logging Axe also crafts at Camp T1 (see `notes`).
- Extra fields beyond the requested schema: `ingredients[].accepts_category` and `source.nwdb_recipe_id`.
- Scope: 44 recipes, which are Weaponsmithing (Longsword, Greatsword T2–T5.2), Engineering (Hatchet T2–T5.2, Flint–Starmetal Logging Axe, Blunderbuss T2–T5.2), and refining T2–T5.2 for Smelting (+ Charcoal), Woodworking and Leatherworking, plus Weaving T2–T5. No armoring, jewelcrafting, arcana, cooking or furnishing. Orichalcum/Mythril Logging Axes and Prismatic/Asmodeum-tier items are not included.
