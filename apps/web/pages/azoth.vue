<script setup lang="ts">
type AzothCost = {
  id: string;
  name: string;
  amount: number | null;
  amount_min: number | null;
  amount_max: number | null;
  confidence: string;
  outdated_risk: boolean;
  source_url: string;
  source_date: string | null;
  notes: string | null;
};

type AzothDoc = {
  meta: { generated_at: string; currency_cap: number | null; scope: string; notes: string };
  costs: AzothCost[];
};

function amountLabel(cost: AzothCost): string {
  if (cost.amount !== null) {
    return String(cost.amount);
  }
  if (cost.amount_min !== null || cost.amount_max !== null) {
    return `${cost.amount_min ?? "unknown"}–${cost.amount_max ?? "unknown"}`;
  }
  return "unknown";
}

const { data, error } = await useAsyncData("azoth", () => $fetch<AzothDoc>("/api/v1/azoth"));
const costs = computed(() => data.value?.costs ?? []);
</script>

<template>
  <div v-if="error">
    <EmptyState title="Azoth" :detail="`API error: ${error.message}`" />
  </div>

  <div v-else-if="data">
    <section class="panel intro">
      <h1>Azoth currency</h1>
      <p class="muted">{{ data.meta.scope }}</p>
      <p class="muted">Generated {{ data.meta.generated_at }}</p>
      <p class="meta-note">
        Wallet cap:
        <strong>{{ data.meta.currency_cap ?? "unknown" }}</strong>
        Azoth (see caps in dataset).
      </p>
      <p class="muted small">{{ data.meta.notes }}</p>
    </section>

    <section class="panel">
      <h2>Costs ({{ costs.length }})</h2>
      <p class="muted">Null amounts render as <strong>unknown</strong>, not zero.</p>

      <article v-for="cost in costs" :key="cost.id" class="cost">
        <header>
          <h3>{{ cost.name }}</h3>
          <span class="amount">{{ amountLabel(cost) }} {{ cost.unit }}</span>
        </header>
        <p class="tags">
          <span class="tag">{{ cost.confidence }}</span>
          <span v-if="cost.outdated_risk" class="tag warn">outdated risk</span>
        </p>
        <p v-if="cost.notes" class="notes">{{ cost.notes }}</p>
        <p class="source">
          <a :href="cost.source_url" rel="noopener noreferrer" target="_blank">Source</a>
          <span class="muted"> · {{ cost.source_date ?? "undated" }}</span>
        </p>
      </article>
    </section>
  </div>
</template>

<style scoped>
.panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
}

.intro h1 {
  margin-top: 0;
}

.muted {
  color: var(--muted);
}

.small {
  font-size: 0.85rem;
}

.cost {
  border-top: 1px solid var(--border);
  padding-top: 0.75rem;
  margin-top: 0.75rem;
}

.cost header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  align-items: baseline;
}

.cost h3 {
  margin: 0;
  font-size: 1rem;
}

.amount {
  font-family: ui-monospace, monospace;
}

.tags {
  margin: 0.35rem 0;
}

.tag {
  display: inline-block;
  font-size: 0.75rem;
  text-transform: uppercase;
  padding: 0.1rem 0.4rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  margin-right: 0.35rem;
}

.warn {
  border-color: #6b5a2e;
  color: #e8d4a8;
}

.notes {
  font-size: 0.9rem;
  color: var(--muted);
}

.source {
  font-size: 0.85rem;
}
</style>