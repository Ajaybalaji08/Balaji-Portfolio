# Dockerfile for running neoverse app (production)
FROM node:22-alpine
WORKDIR /app
# Install dependencies (including dev deps needed for build)
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps || npm install
# Copy source
COPY . .
# Build the frontend and bundle server
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
