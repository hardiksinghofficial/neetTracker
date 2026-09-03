# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build

# Stage 2: Production Runner for Render, Hugging Face & Cloud
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=10000

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Prepare app directory for standard node user (UID 1000)
RUN mkdir -p /app/data && \
    chown -R node:node /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma/

USER node

RUN npm ci --omit=dev
RUN npx prisma generate

COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 10000

CMD ["node", "dist/main.js"]
