# Multi-stage build for a highly efficient, production-ready Sakaboom Node Image
FROM node:20-alpine AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder
# Next.js telemetry is opted out to ensure absolute privacy for Node operators
ENV NEXT_TELEMETRY_DISABLED=1 
WORKDIR /app

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Copy dependencies
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && npm install; \
  fi

# Copy all local project files tightly into the build container
COPY . .

# Build the Next.js application
RUN npm run build


# Step 2. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 sakagroup
RUN adduser --system --uid 1001 sakanode

# Copy public assets and prebuilt engine
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=sakanode:sakagroup /app/.next/standalone ./
COPY --from=builder --chown=sakanode:sakagroup /app/.next/static ./.next/static

USER sakanode
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Execute the standalone high-performance server natively
CMD ["node", "server.js"]
