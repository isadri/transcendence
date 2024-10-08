FROM node:22-alpine3.19

COPY . /code/

WORKDIR  /code

RUN npm install && npm install react-router-dom && \
npm install react-icons --save

CMD [ "npm", "run" , "dev"]
