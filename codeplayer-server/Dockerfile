FROM node:12

MAINTAINER Saurabh Srivastava (saurass.in)
WORKDIR /codeplayer-server
COPY package*.json ./

RUN npm install
COPY . .

CMD ["node", "app.js"]
