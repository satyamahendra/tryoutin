# ─────────────────────────────────────────────
#  Stage 1: deps — install dependencies only
# ─────────────────────────────────────────────
FROM node:24-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

# ─────────────────────────────────────────────
#  Stage 2: builder — build the Next.js app
# ─────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate

RUN npm run build

# ─────────────────────────────────────────────
#  Stage 3: runner — minimal production image
# ─────────────────────────────────────────────
FROM node:24-alpine AS runner

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

RUN npm install prisma

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/node_modules/dotenv ./node_modules/dotenv
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/effect ./node_modules/effect
COPY --from=builder /app/node_modules/fast-check ./node_modules/fast-check
COPY --from=builder /app/node_modules/pure-rand ./node_modules/pure-rand

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static   ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
