FROM node:22-alpine

# Install bash
RUN apk update && apk add bash && apk add --no-cache openssl

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./


RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npx prisma generate 

EXPOSE 8080
CMD [ "npm", "start","start:migrate:prod" ]