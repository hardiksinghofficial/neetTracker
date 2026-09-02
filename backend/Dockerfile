# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build

# Stage 2: Production Runner for Hugging Face Spaces & Cloud
FROM node:20-alpine AS runner

WORKDIR /app

# Hugging Face Spaces port & non-root user (UID 1000)
ENV NODE_ENV=production
ENV PORT=7860

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Create non-root user for Hugging Face (UID 1000)
RUN adduser -D -u 1000 appuser && \
    mkdir -p /app/data && \
    chown -R appuser:appuser /app

COPY --chown=appuser:appuser package*.json ./
COPY --chown=appuser:appuser prisma ./prisma/

USER appuser

RUN npm ci --omit=dev
RUN npx prisma generate

COPY --chown=appuser:appuser --from=builder /app/dist ./dist

EXPOSE 7860

CMD ["node", "dist/main.js"]
