# -----------------------------------------------------------------------------
# Stage 1: Build the Vite production bundle
# -----------------------------------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (better layer caching when only source changes)
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source and build
COPY . .

# Vite bakes VITE_* variables at build time. Override in Coolify build args if needed.
ARG VITE_API_BASE_URL=https://abqd2pkatkuks607gntnz1rb.lanna.engineer
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Serve static assets with nginx (minimal runtime image)
# -----------------------------------------------------------------------------
FROM nginx:1.27-alpine AS production

# Drop the default site; we ship our own SPA-friendly config
RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Coolify / orchestrators map published ports to this container port
EXPOSE 80

# Lightweight health signal for Coolify and docker compose
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
