FROM node:22-alpine

RUN addgroup -S app && adduser -S -G app app

WORKDIR /app

COPY package*.json .

RUN chown -R app:app .

USER app

RUN npm install

COPY . .

EXPOSE 5000

ENV HOST_URL=server MONGODB_URL=mongodb://172.17.0.2:27017/tic-tac-toe

CMD [ "npm", "run", "dev" ]