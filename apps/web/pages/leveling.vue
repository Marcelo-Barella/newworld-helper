<script setup lang="ts">
import { computed } from "vue";

type LevelingSource = {
  url: string;
  title: string;
  date: string | null;
  patch: string;
};

type LevelingStep = {
  step: number | string;
  level_min: number | null;
  level_max: number | null;
  level_range: string;
  zone: string;
  activities: string[];
  why_fast: string;
  xp_estimate: string | null;
  time_estimate: string | null;
  azoth_status: string;
  notes: string | null;
  map_path: string | null;
  sources: LevelingSource[];
};

type LevelingMaterial = {
  item: string;
  quantity: string | number | null;
  needed_at: string | null;
  purpose: string | null;
  gather_where: string | null;
  station: string | null;
  flags: string | null;
  source_url: string | null;
};

type LevelingDoc = {
  generated: string;
  sheet_url: string;
  server: string;
  map_note: string | null;
  steps: LevelingStep[];
  materials: LevelingMaterial[];
};

function stepUnverifiedBand(step: LevelingStep): boolean {
  const min = step.level_min;
  const max = step.level_max;
  if (min !== null && min >= 25) return true;
  if (max !== null && max >= 25) return true;
  if (min !== null && min < 25 && max !== null && max >= 25) return true;
  return false;
}

const { data, error } = await useAsyncData("leveling", () => $fetch<LevelingDoc>("/api/v1/leveling"));

const steps = computed(() => data.value?.steps ?? []);
</script>

<template>
  <div v-if="error" class="panel">
    <h1>Leveling route</h1>
    <p class="muted">API error: {{ error.message }}</p>
  </div>

  <div v-else-if="data">
    <header class="panel hero">
      <h1>Leveling route</h1>
      <p class="muted">
        Snapshot from the
        <a :href="data.sheet_url" rel="noopener noreferrer" target="_blank">NW Leveling sheet</a>.
        Server context: {{ data.server }}.
      </p>
      <p class="meta">Generated {{ data.generated }}</p>
      <p v-if="data.map_note" class="map-note">{{ data.map_note }}</p>

      <ul class="caveats" aria-label="Data caveats">
        <li>XP figures are <strong>pre-2x base, Azoth rate unknown</strong> unless a step says otherwise.</li>
        <li>Time values are <strong>estimates</strong>, not sourced playthrough durations on Azoth.</li>
        <li>Steps overlapping <strong>levels 25–70</strong> are marked <span class="tag">unverified band</span> below.</li>
      </ul>
    </header>

    <section v-if="data.materials.length" class="panel">
      <h2>Materials checklist ({{ data.materials.length }})</h2>
      <ul class="materials">
        <li v-for="(mat, index) in data.materials" :key="`${mat.item}-${index}`">
          <strong>{{ mat.item }}</strong>
          <span class="muted"> · {{ mat.needed_at ?? "—" }}</span>
          <span v-if="mat.quantity !== null"> · qty: {{ mat.quantity }}</span>
          <span v-else class="muted"> · qty: unknown</span>
        </li>
      </ul>
    </section>

    <article v-for="step in steps" :key="String(step.step)" class="panel step">
      <p v-if="stepUnverifiedBand(step)" class="tag unverified">
        Levels 25–70 — treat as unverified on Azoth / unpublished XP rate
      </p>

      <h2>
        Step {{ step.step }}
        <span class="range">{{ step.level_range }}</span>
      </h2>
      <p class="zone">{{ step.zone }}</p>

      <section>
        <h3>Activities</h3>
        <ul>
          <li v-for="(line, index) in step.activities" :key="index">{{ line }}</li>
        </ul>
      </section>

      <section>
        <h3>Why it&apos;s fast</h3>
        <p>{{ step.why_fast }}</p>
      </section>

      <section v-if="step.map_path">
        <h3>Map path</h3>
        <p class="map-path">{{ step.map_path }}</p>
      </section>

      <dl class="facts">
        <div>
          <dt>XP estimate</dt>
          <dd>{{ step.xp_estimate ?? "—" }}</dd>
        </div>
        <div>
          <dt>Time estimate</dt>
          <dd>{{ step.time_estimate ?? "—" }}</dd>
        </div>
        <div>
          <dt>Azoth status</dt>
          <dd>{{ step.azoth_status }}</dd>
        </div>
      </dl>

      <p v-if="step.notes" class="notes">{{ step.notes }}</p>

      <section>
        <h3>Sources</h3>
        <ul class="sources">
          <li v-for="(src, index) in step.sources" :key="`${src.url}-${index}`">
            <a :href="src.url" rel="noopener noreferrer" target="_blank">{{ src.title }}</a>
            <span class="src-meta">{{ src.date ?? "undated" }} · {{ src.patch }}</span>
          </li>
        </ul>
      </section>
    </article>
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

.hero h1 {
  margin-top: 0;
}

.muted {
  color: var(--muted);
}

.meta {
  font-size: 0.9rem;
  color: var(--muted);
}

.caveats {
  margin: 1rem 0 0;
  padding-left: 1.25rem;
  color: var(--muted);
}

.caveats li {
  margin-bottom: 0.35rem;
}

.tag {
  display: inline-block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  border: 1px solid var(--border);
  color: var(--muted);
}

.unverified {
  margin-top: 0;
  margin-bottom: 0.75rem;
  border-color: #6b5a2e;
  color: #e8d4a8;
}

.step h2 {
  margin-bottom: 0.25rem;
  font-size: 1.2rem;
}

.range {
  font-weight: 400;
  color: var(--muted);
  font-size: 0.95rem;
}

.zone {
  color: var(--muted);
  margin-top: 0;
}

.map-note,
.map-path {
  font-size: 0.9rem;
  color: var(--muted);
}

.materials {
  padding-left: 1.1rem;
  color: var(--muted);
}

h3 {
  font-size: 0.95rem;
  margin-bottom: 0.35rem;
}

.facts {
  display: grid;
  gap: 0.75rem;
  margin: 1rem 0;
}

.facts dt {
  font-size: 0.8rem;
  color: var(--muted);
}

.facts dd {
  margin: 0.15rem 0 0;
}

.notes {
  font-size: 0.9rem;
  color: var(--muted);
  border-left: 3px solid var(--border);
  padding-left: 0.75rem;
}

.sources {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sources li {
  margin-bottom: 0.5rem;
}

.src-meta {
  display: block;
  font-size: 0.8rem;
  color: var(--muted);
}
</style>