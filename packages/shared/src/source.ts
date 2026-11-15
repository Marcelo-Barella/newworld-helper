import { z } from "zod";

export const SourceSchema = z.object({
  citation: z.string().min(1),
  url: z.string().nullable(),
  notes: z.string().nullable(),
});

export type Source = z.infer<typeof SourceSchema>;