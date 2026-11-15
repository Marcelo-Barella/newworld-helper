type ApiListResponse<T> = {
  records: T[];
};

export function useApiBase(): string {
  const config = useRuntimeConfig();
  return config.public.apiBase as string;
}

export async function fetchDatasetList<T>(path: string): Promise<ApiListResponse<T>> {
  const base = useApiBase();
  return await $fetch<ApiListResponse<T>>(`${base}${path}`);
}