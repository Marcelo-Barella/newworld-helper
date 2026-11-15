import { z } from "zod";

export const AzothConfidenceSchema = z.enum(["confirmed", "likely", "estimate", "unknown"]);

export const AzothMetaSchema = z.object({
  generated_at: z.string(),
  currency_cap: z.number().nullable(),
  cap_source: z.string().nullable(),
  notes: z.string(),
  scope: z.string(),
});

export const AzothCostSchema = z.object({
  id: z.string(),
  category: z.string(),
  name: z.string(),
  amount: z.number().nullable(),
  amount_min: z.number().nullable(),
  amount_max: z.number().nullable(),
  unit: z.string(),
  conditions: z.string().nullable(),
  patch_or_season: z.string().nullable(),
  source_url: z.string(),
  source_date: z.string().nullable(),
  confidence: AzothConfidenceSchema,
  outdated_risk: z.boolean(),
  notes: z.string().nullable(),
});

export const AzothEarnSchema = z.object({
  id: z.string(),
  method: z.string(),
  rough_amount: z.number().nullable(),
  amount_min: z.number().nullable(),
  amount_max: z.number().nullable(),
  per: z.string().nullable(),
  level_range: z.string().nullable(),
  patch_or_season: z.string().nullable(),
  source_url: z.string(),
  source_date: z.string().nullable(),
  confidence: AzothConfidenceSchema,
  notes: z.string().nullable(),
});

export const AzothCapSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number().nullable(),
  source_url: z.string(),
  source_date: z.string().nullable(),
  confidence: AzothConfidenceSchema,
  notes: z.string().nullable(),
});

export const AzothSpendTipSchema = z.object({
  id: z.string(),
  tip: z.string(),
  verdict: z.string(),
  reason: z.string(),
  source_url: z.string(),
  source_date: z.string().nullable(),
});

export const AzothStaffSourceSchema = z.object({
  source_url: z.string(),
  source_date: z.string().nullable(),
  notes: z.string().nullable(),
});

export const AzothStaffSchema = z.object({
  summary: z.string(),
  still_relevant_in_aeternum: z.boolean(),
  quest_name: z.string().nullable(),
  quest_id: z.string().nullable(),
  suggested_level: z.number().nullable(),
  crafted_via_trade_skill: z.boolean(),
  sources: z.array(AzothStaffSourceSchema),
});

export const ProjectAzothServerSchema = z.object({
  note: z.string(),
  source_url: z.string(),
  source_date: z.string().nullable(),
  snapshot: z
    .object({
      build: z.string(),
      generated_at_utc: z.string(),
      packets: z.object({
        solved: z.number(),
        captured: z.number(),
        wanted: z.number(),
        total: z.number(),
      }),
    })
    .nullable(),
  notes: z.string().nullable(),
});

export const AzothFileSchema = z.object({
  meta: AzothMetaSchema,
  costs: z.array(AzothCostSchema),
  earn: z.array(AzothEarnSchema),
  caps: z.array(AzothCapSchema),
  spend_tips: z.array(AzothSpendTipSchema),
  azoth_staff: AzothStaffSchema,
  project_azoth_server: ProjectAzothServerSchema,
});

export type AzothFile = z.infer<typeof AzothFileSchema>;
export type AzothCost = z.infer<typeof AzothCostSchema>;

export function formatAzothAmount(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "unknown";
  }
  return String(value);
}