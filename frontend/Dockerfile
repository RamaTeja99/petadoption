<<<<<<< HEAD
# Build stage (Node for Vite build)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
=======
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
>>>>>>> 29bb20e86dc194e7d6430264a9d88d88f08a97bd
RUN npm install
COPY . .
RUN npm run build

<<<<<<< HEAD
# Serve static files using nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .
=======
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
>>>>>>> 29bb20e86dc194e7d6430264a9d88d88f08a97bd
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
