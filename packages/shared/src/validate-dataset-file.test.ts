import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  AzothFileSchema,
  CraftingRecipesFileSchema,
  FarmingRoutesFileSchema,
  LevelingFileSchema,
} from "./index";
import { validateDatasetFile } from "./validate-dataset-file";
import { DatasetKind } from "./datasets";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");

describe("dataset schemas", () => {
  it("validates bundled crafting recipes array", async () => {
    const raw = await readFile(join(repoRoot, "data/crafting-recipes.json"), "utf8");
    const parsed = CraftingRecipesFileSchema.parse(JSON.parse(raw));
    expect(parsed).toHaveLength(44);
  });

  it("validates bundled farming routes file", async () => {
    const raw = await readFile(join(repoRoot, "data/farming-routes.json"), "utf8");
    const parsed = FarmingRoutesFileSchema.parse(JSON.parse(raw));
    expect(parsed.routes).toHaveLength(61);
    expect(parsed.routes[0]?.waypoints[0]?.x).toBeNull();
  });

  it("validates bundled leveling export", async () => {
    const raw = await readFile(join(repoRoot, "data/leveling.json"), "utf8");
    const parsed = LevelingFileSchema.parse(JSON.parse(raw));
    expect(parsed.steps).toHaveLength(15);
    expect(parsed.materials.length).toBeGreaterThan(0);
    expect(parsed.map_note).toBeTruthy();
  });

  it("validates bundled azoth export", async () => {
    const raw = await readFile(join(repoRoot, "data/azoth.json"), "utf8");
    const parsed = validateDatasetFile(DatasetKind.Azoth, JSON.parse(raw));
    expect(parsed.costs).toHaveLength(16);
    expect(parsed.earn).toHaveLength(13);
    AzothFileSchema.parse(parsed);
  });
});