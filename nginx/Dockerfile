FROM debian:bullseye

RUN apt update && apt install -y nginx openssl

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout /etc/ssl/private/nginx-selfsigned.key \
	-out /etc/ssl/certs/nginx-selfsigned.crt \
	-subj "/CN=$SSL_CN"

COPY conf/conf.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /var/www/html

CMD [ "nginx", "-g", "daemon off;" ]