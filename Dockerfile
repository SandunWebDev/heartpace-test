# STAGE 1: Build
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./

# Increase the memory limit for the build process, (In case we are doing build in a low memory VM)
ENV NODE_OPTIONS="--max-old-space-size=2048"

RUN npm install

COPY . .

RUN npm run build


# STAGE 2: Serve with NginX
FROM nginx:alpine

# Copy the built app's static files from the build stage to Nginx's default public directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]