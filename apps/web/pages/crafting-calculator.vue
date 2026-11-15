<script setup lang="ts">
type CraftingResponse = {
  meta: {
    record_count: number;
    data_version: string;
    calc_logic_doc: string;
  };
  records: { id: string; name: string }[];
};

const { data, error } = await useAsyncData("crafting-recipes", () =>
  $fetch<CraftingResponse>("/api/v1/crafting-recipes"),
);
const count = computed(() => data.value?.records.length ?? 0);
</script>

<template>
  <div v-if="error">
    <EmptyState title="Crafting calculator" :detail="`API error: ${error.message}`" />
  </div>
  <EmptyState
    v-else
    title="Crafting calculator"
    detail="Calculator UI is out of scope for this PR. Recipe data and expansion logic are in the API and docs/crafting/CALC_LOGIC.md."
    :record-count="count"
  />
  <p v-if="data" class="meta muted">
    Data: {{ data.meta.data_version }} · logic: <code>{{ data.meta.calc_logic_doc }}</code>
  </p>
</template>

<style scoped>
.meta {
  margin-top: 0.75rem;
  font-size: 0.9rem;
}
</style>