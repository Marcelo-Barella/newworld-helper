const apiHost = process.env.API_HOST ?? "127.0.0.1";
const apiPort = process.env.API_PORT ?? "4000";
const apiTarget = `http://${apiHost}:${apiPort}`;

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  typescript: {
    strict: true,
    typeCheck: false,
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "/api/v1",
    },
  },
  nitro: {
    devProxy: {
      "/api": { target: `${apiTarget}/api`, changeOrigin: true },
      "/mcp": { target: `${apiTarget}/mcp`, changeOrigin: true },
    },
    routeRules: {
      "/api/**": { proxy: `${apiTarget}/api/**` },
      "/mcp": { proxy: `${apiTarget}/mcp` },
      "/mcp/**": { proxy: `${apiTarget}/mcp/**` },
    },
  },
  app: {
    head: {
      title: "New World Helper",
      meta: [
        {
          name: "description",
          content: "Open-source companion for New World: Aeternum (data layer scaffold)",
        },
      ],
    },
  },
});