FROM node:18-alpine AS building

WORKDIR /build
COPY package.json package-lock.json ./
RUN npm install

ARG BACKEND_URL
ENV VITE_BACKEND_URL=$BACKEND_URL

COPY . . 
RUN npm run build

FROM nginx:alpine AS running
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=building /build/dist /usr/share/nginx/html
