FROM --platform=linux/amd64 node:23.4
WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve
RUN npm i -g vite

COPY . .

RUN vite build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]
