FROM node:25-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY resource-service.js .

CMD ["node", "resource-service.js"]