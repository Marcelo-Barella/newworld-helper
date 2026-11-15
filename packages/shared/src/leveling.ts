import { z } from "zod";

export const LevelingSourceRefSchema = z.object({
  url: z.string(),
  title: z.string(),
  date: z.string().nullable(),
  patch: z.string(),
});

export const LevelingStepSchema = z.object({
  step: z.union([z.number(), z.string()]),
  level_min: z.number().nullable(),
  level_max: z.number().nullable(),
  level_range: z.string(),
  zone: z.string(),
  activities: z.array(z.string()),
  why_fast: z.string(),
  xp_estimate: z.string().nullable(),
  time_estimate: z.string().nullable(),
  azoth_status: z.string(),
  notes: z.string().nullable(),
  map_path: z.string().nullable(),
  sources: z.array(LevelingSourceRefSchema),
});

export const LevelingMaterialSchema = z.object({
  item: z.string(),
  quantity: z.union([z.string(), z.number()]).nullable(),
  needed_at: z.string().nullable(),
  purpose: z.string().nullable(),
  gather_where: z.string().nullable(),
  station: z.string().nullable(),
  flags: z.string().nullable(),
  source_url: z.string().nullable(),
});

export const LevelingFileSchema = z.object({
  generated: z.string(),
  sheet_url: z.string(),
  server: z.string(),
  map_note: z.string().nullable(),
  steps: z.array(LevelingStepSchema),
  materials: z.array(LevelingMaterialSchema),
});

export type LevelingSourceRef = z.infer<typeof LevelingSourceRefSchema>;
export type LevelingStep = z.infer<typeof LevelingStepSchema>;
export type LevelingMaterial = z.infer<typeof LevelingMaterialSchema>;
export type LevelingFile = z.infer<typeof LevelingFileSchema>;

export function levelingStepId(step: LevelingStep): string {
  return String(step.step);
}

export function isLevelingStepUnverifiedBand(step: LevelingStep): boolean {
  const min = step.level_min;
  const max = step.level_max;
  if (min !== null && min >= 25) {
    return true;
  }
  if (max !== null && max >= 25) {
    return true;
  }
  if (min !== null && min < 25 && max !== null && max >= 25) {
    return true;
  }
  return false;
}