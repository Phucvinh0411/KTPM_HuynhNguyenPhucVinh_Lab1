FROM node:25-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY auth-service.js .

EXPOSE 3000

CMD ["node", "auth-service.js"]