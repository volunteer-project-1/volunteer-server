FROM node:16.4.2-alpine AS base
WORKDIR /app
COPY package-lock.json package.json ./
RUN mkdir logs && chmod -R 777 ./logs
RUN npm ci

FROM base AS build
WORKDIR /app
COPY tsconfig.json ./
COPY src src
COPY .env ./
COPY .swcrc ./
COPY prisma prisma
RUN npm ci
RUN npx prisma generate
RUN npm run build

FROM base AS dev
WORKDIR /app
ENV NODE_ENV=development
COPY tsconfig.json ./
COPY awsconfig.storj.json ./
COPY src src
COPY --from=build /app/dist /app/dist
RUN npm ci
# RUN cd /app/node_modules && mkdir .prisma
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma

FROM base AS prod
WORKDIR /app
COPY package-lock.json package.json ./
COPY awsconfig.storj.json ./
COPY --from=build /app/dist /app/dist
RUN npm ci --only=production --ignore-scripts
RUN cd /app/node_modules && mkdir .prisma
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma

USER node
CMD ["npm", "start"]
