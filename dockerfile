FROM node:20-alpine AS BASE

WORKDIR /app
COPY web /app/web
COPY rest /app/rest

RUN cd web && npm install && npm run build
RUN cd rest && npm install