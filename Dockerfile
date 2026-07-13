# Dockerfile for running neoverse app (production)
FROM node:22-slim
WORKDIR /app
# Install dependencies (including dev deps needed for build)
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps || npm install
# Copy source
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=450"
# Build the frontend and bundle server
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
