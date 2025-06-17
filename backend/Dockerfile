# 🚀 SoalEdu Backend - Production Dockerfile
# Multi-stage build for optimal image size

# Stage 1: Build Stage
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production --prefer-offline --no-audit

# Copy source code
COPY src/ ./src/
COPY .env.example ./.env

# Build TypeScript
RUN npm run build

# Remove dev dependencies and clean npm cache
RUN npm prune --production && \
    npm cache clean --force

# Stage 2: Production Stage
FROM node:18-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache \
    cairo \
    jpeg \
    pango \
    musl \
    giflib \
    pixman \
    font-noto-emoji \
    ttf-dejavu \
    dumb-init \
    curl \
    && rm -rf /var/cache/apk/*

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=backend:nodejs /app/dist ./dist
COPY --from=builder --chown=backend:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=backend:nodejs /app/package*.json ./

# Copy additional files
COPY --chown=backend:nodejs .env.example ./.env
COPY --chown=backend:nodejs ecosystem.config.js ./

# Create logs directory
RUN mkdir -p /app/logs && \
    chown -R backend:nodejs /app/logs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Switch to non-root user
USER backend

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/server.js"]

# Build arguments for metadata
ARG BUILD_DATE
ARG VERSION
ARG NODE_ENV=production

# Labels for metadata
LABEL maintainer="SoalEdu Team <dev@soaledu.ir>"
LABEL org.opencontainers.image.title="SoalEdu Backend API"
LABEL org.opencontainers.image.description="Persian Educational Exam System Backend"
LABEL org.opencontainers.image.version="$VERSION"
LABEL org.opencontainers.image.created="$BUILD_DATE"
LABEL org.opencontainers.image.source="https://github.com/soaledu/backend"
LABEL org.opencontainers.image.licenses="MIT" 