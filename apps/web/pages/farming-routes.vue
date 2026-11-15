<script setup lang="ts">
type Waypoint = { name: string; x: number | null; y: number | null; contents: string | null };
type Route = {
  id: string;
  name: string;
  region: string | null;
  materials: string[];
  waypoints: Waypoint[];
  node_count: string | null;
  tradeskill_req: string | null;
};
type FarmingDoc = {
  meta: { generated: string; patch: string; notes: string[] };
  routes: Route[];
};

const { data, error } = await useAsyncData("farming-routes", () => $fetch<FarmingDoc>("/api/v1/farming-routes"));
const routes = computed(() => data.value?.routes ?? []);
</script>

<template>
  <div v-if="error">
    <EmptyState title="Farming routes" :detail="`API error: ${error.message}`" />
  </div>

  <div v-else-if="data">
    <section class="panel intro">
      <h1>Farming routes</h1>
      <p class="muted">{{ data.meta.patch }}</p>
      <p class="muted">Generated {{ data.meta.generated }}</p>
      <ul class="caveats">
        <li v-for="(note, index) in data.meta.notes" :key="index">{{ note }}</li>
      </ul>
      <p class="count">{{ routes.length }} routes loaded. Waypoint coordinates are not plotted (x/y are null in data).</p>
    </section>

    <article v-for="route in routes" :key="route.id" class="panel route">
      <h2>{{ route.name }}</h2>
      <p class="muted">{{ route.region }} · {{ route.materials.join(", ") }}</p>
      <p v-if="route.node_count"><strong>Nodes:</strong> {{ route.node_count }}</p>
      <p v-if="route.tradeskill_req"><strong>Requirement:</strong> {{ route.tradeskill_req }}</p>
      <section v-if="route.waypoints.length">
        <h3>Stops</h3>
        <ul>
          <li v-for="(wp, index) in route.waypoints" :key="`${route.id}-${index}`">
            {{ wp.name }}
            <span v-if="wp.contents" class="muted"> ({{ wp.contents }})</span>
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

.intro h1,
.route h2 {
  margin-top: 0;
}

.muted {
  color: var(--muted);
}

.caveats {
  color: var(--muted);
  padding-left: 1.25rem;
}

.count {
  font-size: 0.95rem;
}

h3 {
  font-size: 0.95rem;
  margin-bottom: 0.35rem;
}

.route ul {
  margin: 0;
  padding-left: 1.25rem;
}
</style>