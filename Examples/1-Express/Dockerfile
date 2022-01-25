FROM node:14.16.0-alpine3.13 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:14.16.0-alpine3.13 as release
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist
EXPOSE 5000
ENTRYPOINT ["node", "dist/server.js"]

