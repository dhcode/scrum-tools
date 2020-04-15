FROM node:12-alpine

# Backend
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci


# Frontend
WORKDIR /usr/src/app/scrum-tools-ui

COPY scrum-tools-ui/package*.json ./
RUN npm ci


WORKDIR /usr/src/app
COPY . .

# Build backend
RUN npm run build
RUN npm prune --production

# Build frontend
WORKDIR /usr/src/app/scrum-tools-ui
RUN npm run build
RUN rm -r node_modules


WORKDIR /usr/src/app
EXPOSE 3000
CMD [ "node", "dist/main.js" ]
