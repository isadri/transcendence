FROM node:22-alpine3.19

WORKDIR  /code

RUN addgroup -S frontgroup && adduser -S frontuser -G frontgroup

COPY . /code/

RUN chown -R frontuser:frontgroup /code

USER frontuser

RUN npm install 

RUN npm run build
