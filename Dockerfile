# Stage 1: Build React application
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files and build
COPY . .
RUN npm run build

# Stage 2: Serve React application using Nginx
FROM nginx:alpine
# Copy built files from Stage 1 to Nginx default public folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy our custom Nginx configuration for routing and reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
