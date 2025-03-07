# syntax = docker/dockerfile:1
ARG BUN_VERSION=1.2.2
# ARG NODE_VERSION=22.14.0

FROM oven/bun:${BUN_VERSION}-slim AS base

LABEL fly_launch_runtime="Bun/Prisma"

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base AS build
WORKDIR /builder

COPY . .
RUN bun install --frozen-lockfile --filter="server"
RUN cd server; bunx prisma generate
RUN cd server; bun run :build

# Final stage for app image
FROM base AS runner

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

WORKDIR /app
COPY ./package.json /app/package.json
COPY ./scripts /app/scripts
# Copy built application
COPY --from=build /builder/server/target/index.js /app/server/index.js
COPY --from=build /builder/node_modules/.prisma /app/node_modules/.prisma

EXPOSE 3000
CMD [ "bun", "run", "./server/index.js" ]
