FROM node:20-alpine AS build

# Backend
WORKDIR /usr/src/app

COPY package*.json ./
COPY scrum-tools-ui/package*.json ./scrum-tools-ui/
RUN npm ci \
    && cd scrum-tools-ui \
    && npm ci

WORKDIR /usr/src/app
COPY . .

# Build backend
RUN npm run build && npm prune --production

# Build frontend
WORKDIR /usr/src/app/scrum-tools-ui
RUN npm run build && rm -r node_modules


FROM node:20-alpine

WORKDIR /usr/src/app
COPY --from=build /usr/src/app .
EXPOSE 3000
CMD [ "node", "dist/main.js" ]
