FROM node:19-alpine as builder

ENV NODE_ENV=development
ENV HOST=0.0.0.0
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . ./

RUN npm run-script build

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


