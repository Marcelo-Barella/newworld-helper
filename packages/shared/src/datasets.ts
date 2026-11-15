import { z } from "zod";
import { AzothFileSchema } from "./azoth";
import { CraftingRecipesFileSchema } from "./crafting-recipes";
import { FarmingRoutesFileSchema } from "./farming-routes";
import { LevelingFileSchema } from "./leveling";

export const DatasetKind = {
  FarmingRoutes: "farming-routes",
  Leveling: "leveling",
  CraftingRecipes: "crafting-recipes",
  Azoth: "azoth",
} as const;

export type DatasetKind = (typeof DatasetKind)[keyof typeof DatasetKind];

export type AzothDatasetKind = typeof DatasetKind.Azoth;

export const datasetFileNames: Record<DatasetKind, string> = {
  [DatasetKind.FarmingRoutes]: "farming-routes.json",
  [DatasetKind.Leveling]: "leveling.json",
  [DatasetKind.CraftingRecipes]: "crafting-recipes.json",
  [DatasetKind.Azoth]: "azoth.json",
};

export type DatasetFile = {
  [DatasetKind.FarmingRoutes]: z.infer<typeof FarmingRoutesFileSchema>;
  [DatasetKind.CraftingRecipes]: z.infer<typeof CraftingRecipesFileSchema>;
  [DatasetKind.Azoth]: z.infer<typeof AzothFileSchema>;
  [DatasetKind.Leveling]: z.infer<typeof LevelingFileSchema>;
};

export const datasetSchemas = {
  [DatasetKind.FarmingRoutes]: FarmingRoutesFileSchema,
  [DatasetKind.Leveling]: LevelingFileSchema,
  [DatasetKind.CraftingRecipes]: CraftingRecipesFileSchema,
  [DatasetKind.Azoth]: AzothFileSchema,
} as const satisfies Record<DatasetKind, z.ZodType>;