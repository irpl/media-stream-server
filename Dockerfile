FROM node:14-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000

CMD [ "node", "index.js" ]

# docker build . -t stream && docker run -v music:/usr/src/app/music -p 8000:8000 -d stream