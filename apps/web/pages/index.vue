<template>
  <div>
    <section class="panel hero">
      <h1>New World Helper</h1>
      <p class="lead">
        Open-source companion for New World: Aeternum (planned:
        <span class="domain">newworld.bergamota.dev</span>). The repo ships real JSON for all four datasets, validated at API startup and exposed through <code>/api/v1</code> and read-only MCP tools for bots.
      </p>
    </section>

    <section class="panel">
      <h2>Datasets</h2>
      <ul class="datasets">
        <li>
          <NuxtLink to="/leveling">Leveling</NuxtLink>
          — NW Leveling sheet export: 15 steps, 34 materials, map notes (source: Google Sheet snapshot in
          <code>data/leveling.json</code>).
        </li>
        <li>
          <NuxtLink to="/farming-routes">Farming routes</NuxtLink>
          — 61 community gathering routes with meta (source: th.gl / nwdb gatherables; waypoint coords null until sourced).
        </li>
        <li>
          <NuxtLink to="/crafting-calculator">Crafting recipes</NuxtLink>
          — 44 nwdb recipes, LIVE 11/04/2025 (source: <code>data/crafting-recipes.json</code>; logic in
          <code>docs/crafting/CALC_LOGIC.md</code>).
        </li>
        <li>
          <NuxtLink to="/azoth">Azoth</NuxtLink>
          — wallet costs, earn methods, caps, and spend tips (source: official patch notes + guides in
          <code>data/azoth.json</code>).
        </li>
      </ul>
      <p class="muted">
        MCP: <code>get_leveling</code>, <code>get_farming_routes</code>, <code>get_crafting_recipes</code>,
        <code>get_azoth</code>, plus list/get helpers per dataset.
      </p>
    </section>

    <section class="panel">
      <h2>Stub tools</h2>
      <ul class="links">
        <li><NuxtLink to="/map">Map</NuxtLink> — no coordinates plotted yet</li>
        <li><NuxtLink to="/skill-tree-builder">Skill tree builder</NuxtLink></li>
        <li><NuxtLink to="/weapon-skill-maker">Weapon skill maker</NuxtLink></li>
        <li><NuxtLink to="/build-maker">Build maker</NuxtLink></li>
      </ul>
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

.hero h1 {
  margin-top: 0;
}

.lead {
  color: var(--muted);
  margin-bottom: 0;
}

.domain {
  color: var(--text);
}

.datasets,
.links {
  margin: 0.5rem 0 0;
  padding-left: 1.25rem;
  color: var(--muted);
}

.datasets li,
.links li {
  margin-bottom: 0.5rem;
}

h2 {
  margin-top: 0;
  font-size: 1.1rem;
}

.muted {
  font-size: 0.9rem;
  color: var(--muted);
  margin-top: 1rem;
  margin-bottom: 0;
}

code {
  font-size: 0.85em;
}
</style>