FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY ./package*.json .

COPY . .

ARG VITE_API_URL
ARG VITE_WS_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL

RUN npm install 

RUN npm run build

FROM nginx:latest AS web

COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/dist /var/www/html/public

# run with docker run -p 80:80 --name front -d telegrammy/frontend:test