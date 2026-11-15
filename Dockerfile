FROM node:22-bookworm-slim AS base
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* .npmrc ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile || pnpm install

FROM deps AS build
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/api apps/api
COPY apps/web apps/web
COPY data data
RUN pnpm --filter @newworld-helper/shared build \
  && pnpm --filter @newworld-helper/api build \
  && pnpm --filter @newworld-helper/web build

FROM base AS runner
ENV NODE_ENV=production
ENV API_PORT=4000
ENV DATA_DIR=/app/data
ENV NUXT_PUBLIC_API_BASE=/api/v1
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/packages/shared /app/packages/shared
COPY --from=build /app/apps/api/dist /app/apps/api/dist
COPY --from=build /app/apps/api/package.json /app/apps/api/package.json
COPY --from=build /app/apps/web/.output /app/apps/web/.output
COPY --from=build /app/apps/web/package.json /app/apps/web/package.json
COPY --from=build /app/data /app/data
COPY package.json pnpm-workspace.yaml ./
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 8080
CMD ["/entrypoint.sh"]