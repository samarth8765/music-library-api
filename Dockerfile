FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN echo "Installing dependencies..."

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN npx prisma generate

RUN pnpm run build

######################################################

FROM node:20-slim AS runner

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV production

EXPOSE 3000

CMD ["pnpm", "run", "start"]