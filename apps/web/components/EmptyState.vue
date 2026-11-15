<script setup lang="ts">
defineProps<{
  title: string;
  detail: string;
  recordCount?: number;
}>();
</script>

<template>
  <section class="panel">
    <h1>{{ title }}</h1>
    <p class="muted">{{ detail }}</p>
    <p v-if="recordCount !== undefined" class="count">
      Records loaded from API: <strong>{{ recordCount }}</strong>
    </p>
    <p v-if="recordCount === 0" class="empty">No curated data yet. Datasets ship empty until imported.</p>
  </section>
</template>

<style scoped>
.panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
}

h1 {
  margin-top: 0;
  font-size: 1.5rem;
}

.muted {
  color: var(--muted);
}

.count {
  margin-bottom: 0.25rem;
}

.empty {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px dashed var(--border);
  color: var(--muted);
}
</style>