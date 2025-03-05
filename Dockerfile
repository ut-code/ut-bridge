# syntax = docker/dockerfile:1
ARG BUN_VERSION=1.2.2
# ARG NODE_VERSION=22.14.0

# fuck prisma
FROM oven/bun:${BUN_VERSION}-slim AS base
# FROM oven/bun:${BUN_VERSION}-slim AS base

LABEL fly_launch_runtime="Bun/Prisma"

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base AS build
WORKDIR /builder

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

COPY . .
RUN bun install --frozen-lockfile --ignore-scripts --filte="server"

# Final stage for app image
FROM base AS runner

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

WORKDIR /app
# Copy built application
COPY --from=build /builder/server /app/server
COPY --from=build /builder/common /app/common
COPY --from=build /builder/node_modules /app/node_modules
# fuck prisma
COPY ./node_modules/.prisma /app/node_modules/.prisma

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "bun", "run", "./server" ]
