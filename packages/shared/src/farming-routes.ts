import { z } from "zod";

export const FarmingRoutesMetaSchema = z.object({
  generated: z.string(),
  game: z.string(),
  patch: z.string(),
  notes: z.array(z.string()),
});

export const FarmingWaypointSchema = z.object({
  name: z.string(),
  x: z.number().nullable(),
  y: z.number().nullable(),
  contents: z.string().nullable(),
});

export const FarmingRouteSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  region: z.string().nullable(),
  materials: z.array(z.string()),
  tier: z.string().nullable(),
  waypoints: z.array(FarmingWaypointSchema),
  respawn: z.string().nullable(),
  node_count: z.string().nullable(),
  loop_time: z.string().nullable(),
  tradeskill_req: z.string().nullable(),
  tool_tier: z.string().nullable(),
  danger: z.string().nullable(),
  nearest_town: z.string().nullable(),
  zone_level: z.string().nullable(),
  patch_notes: z.string().nullable(),
  sources: z.array(z.string()),
  notes: z.string().nullable(),
});

export const FarmingRoutesFileSchema = z.object({
  meta: FarmingRoutesMetaSchema,
  routes: z.array(FarmingRouteSchema),
});

export type FarmingRoutesMeta = z.infer<typeof FarmingRoutesMetaSchema>;
export type FarmingWaypoint = z.infer<typeof FarmingWaypointSchema>;
export type FarmingRoute = z.infer<typeof FarmingRouteSchema>;
export type FarmingRoutesFile = z.infer<typeof FarmingRoutesFileSchema>;