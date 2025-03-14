FROM node:20.17-alpine

WORKDIR /app

COPY package*.json ./

COPY .env /app/.env

RUN npm install

RUN npm install -g serve

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]