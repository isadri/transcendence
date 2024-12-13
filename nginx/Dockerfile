FROM debian:bullseye

RUN apt update && apt install -y nginx

RUN chmod 644 /var/log/nginx/access.log

CMD [ "nginx", "-g", "daemon off;" ]
