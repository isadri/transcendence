FROM node:22-alpine3.19

COPY . /code/

WORKDIR  /code

RUN npm install && npm install axios chart.js @types/chart.js react-chartjs-2 chartjs-plugin-datalabels


CMD [ "npm", "run" , "dev"]