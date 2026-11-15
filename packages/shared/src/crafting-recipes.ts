import { z } from "zod";

export const CraftingRecipeSourceSchema = z.object({
  url: z.string(),
  nwdb_recipe_id: z.string(),
  accessed: z.string(),
  patch: z.string(),
});

export const CraftingRecipeIngredientSchema = z.object({
  item: z.string().nullish(),
  item_id: z.string().nullish(),
  qty: z.number().nullish(),
  accepts_category: z.string().nullish(),
});

export const CraftingRecipeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tradeskill: z.string().nullable(),
  level_required: z.number().nullable(),
  station: z.string().nullable(),
  station_tier: z.number().nullable(),
  ingredients: z.array(CraftingRecipeIngredientSchema),
  output_qty: z.number().nullable(),
  xp: z.number().nullable(),
  source: CraftingRecipeSourceSchema,
  notes: z.string().nullable(),
});

export const CraftingRecipesFileSchema = z.array(CraftingRecipeSchema);

export const CraftingRecipesMetaSchema = z.object({
  dataset: z.literal("crafting-recipes"),
  record_count: z.number().int().nonnegative(),
  data_source: z.string(),
  data_version: z.string(),
  accessed: z.string().nullable(),
  calc_logic_doc: z.literal("docs/crafting/CALC_LOGIC.md"),
});

export type CraftingRecipe = z.infer<typeof CraftingRecipeSchema>;
export type CraftingRecipesFile = z.infer<typeof CraftingRecipesFileSchema>;
export type CraftingRecipesMeta = z.infer<typeof CraftingRecipesMetaSchema>;

export function buildCraftingRecipesMeta(records: CraftingRecipesFile): CraftingRecipesMeta {
  const first = records[0];
  return {
    dataset: "crafting-recipes",
    record_count: records.length,
    data_source: "nwdb.info",
    data_version: first?.source.patch ?? "unknown",
    accessed: first?.source.accessed ?? null,
    calc_logic_doc: "docs/crafting/CALC_LOGIC.md",
  };
}