import type { ZodType } from "zod";
import { datasetSchemas, type DatasetFile, type DatasetKind } from "./datasets";

export function validateDatasetFile<K extends DatasetKind>(kind: K, data: unknown): DatasetFile[K] {
  const schema = datasetSchemas[kind] as ZodType;
  return schema.parse(data) as DatasetFile[K];
}