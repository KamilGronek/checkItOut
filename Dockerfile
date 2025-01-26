# Build
FROM node:alpine AS builder
WORKDIR /app
COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm install -g @angular/cli 
RUN npm audit fix --force

# Install curl for health checks
RUN apk add --no-cache curl

# Serve with pm2
RUN npm install -g pm2
EXPOSE 4200

CMD ["pm2-runtime", "start", "ng", "--", "serve", "--configuration=test", "--host", "0.0.0.0", "--disable-host-check"]