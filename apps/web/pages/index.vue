<template>
  <div>
    <EmptyState
      title="New World Helper"
      detail="Scaffold for an open-source companion (newworld.bergamota.dev). Tooling, API, and MCP are wired; all four datasets ship real JSON (leveling, farming routes, crafting recipes, azoth)."
    />
    <ul class="links">
      <li><NuxtLink to="/leveling">Leveling route</NuxtLink> — NW Leveling sheet export (15 steps)</li>
      <li><NuxtLink to="/farming-routes">Farming routes</NuxtLink> — dataset backed</li>
      <li><NuxtLink to="/crafting-calculator">Crafting calculator</NuxtLink> — recipes dataset</li>
      <li><NuxtLink to="/map">Map</NuxtLink> — UI stub (no map dataset yet)</li>
    </ul>
  </div>
</template>

<style scoped>
.links {
  margin-top: 1.25rem;
  padding-left: 1.25rem;
  color: var(--muted);
}
</style>