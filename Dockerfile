FROM node:16.4.2-alpine AS base
WORKDIR /app
COPY package-lock.json package.json ./
RUN npm ci

FROM base AS build
WORKDIR /app
COPY tsconfig.json ./
COPY src src
RUN npm run build

FROM base AS dev
ENV NODE_ENV=development
COPY tsconfig.json ./
COPY src src
COPY --from=build /app/dist dist
RUN npm ci

FROM base AS prod
WORKDIR /app
COPY package-lock.json package.json ./
COPY --from=build /app/dist dist
RUN npm ci --only=production --ignore-scripts

USER node
CMD ["npm", "start"]
