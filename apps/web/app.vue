<template>
  <div class="layout">
    <header class="site-header">
      <NuxtLink to="/" class="brand">New World Helper</NuxtLink>
      <nav class="nav">
        <NuxtLink to="/map">Map</NuxtLink>
        <NuxtLink to="/farming-routes">Farming routes</NuxtLink>
        <NuxtLink to="/leveling">Leveling</NuxtLink>
        <NuxtLink to="/skill-tree-builder">Skill tree</NuxtLink>
        <NuxtLink to="/weapon-skill-maker">Weapon skills</NuxtLink>
        <NuxtLink to="/build-maker">Builds</NuxtLink>
        <NuxtLink to="/crafting-calculator">Crafting</NuxtLink>
        <NuxtLink to="/azoth">Azoth</NuxtLink>
      </nav>
    </header>
    <main class="main">
      <NuxtPage />
    </main>
    <footer class="site-footer">
      <p>MIT licensed companion for New World: Aeternum. Not affiliated with Amazon Games.</p>
    </footer>
  </div>
</template>

<style>
:root {
  color-scheme: dark;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  line-height: 1.5;
  --bg: #0f1419;
  --panel: #1a2332;
  --text: #e8eef5;
  --muted: #9aabb9;
  --accent: #6cb4d9;
  --border: #2c3a4d;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
}

a {
  color: var(--accent);
}

.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
  background: var(--panel);
}

.brand {
  font-weight: 700;
  text-decoration: none;
  color: var(--text);
}

.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  font-size: 0.95rem;
}

.nav a {
  text-decoration: none;
}

.nav a.router-link-active {
  text-decoration: underline;
}

.main {
  flex: 1;
  padding: 1.25rem;
  max-width: 56rem;
  width: 100%;
  margin: 0 auto;
}

.site-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--border);
  font-size: 0.85rem;
  color: var(--muted);
}
</style>