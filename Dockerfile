FROM node:20-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

FROM base AS deps

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./

# Fallback — tetap cepat, tapi tolerant terhadap lockfile yang tidak sinkron
RUN npm install --omit=dev --prefer-offline --no-audit

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=2026 \
    HOSTNAME=0.0.0.0

RUN addgroup -g 1001 nextjs \
  && adduser -D -u 1001 -G nextjs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./public/_next/static

USER nextjs
EXPOSE 2026
CMD ["node", "server.js"]
