# Stage 1: Dependencies and Build
FROM oven/bun:alpine AS builder
WORKDIR /app

# Copy dependency files
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Next.js telemetry disable
ENV NEXT_TELEMETRY_DISABLED 1

# Build the Next.js app
RUN bun run build

# Stage 2: Production runner
FROM oven/bun:alpine AS production
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 bun-group && \
    adduser --system --uid 1001 nextjs

# Set up the public directory and .next standalone output
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:bun-group /app/.next/standalone ./
COPY --from=builder --chown=nextjs:bun-group /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the standalone server using bun
CMD ["bun", "run", "server.js"]
