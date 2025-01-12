FROM debian:bullseye

RUN addgroup -S nginxgroup && adduser -S nginxuser -G nginxgroup

RUN apt update && apt install -y nginx openssl

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout /etc/ssl/private/nginx-selfsigned.key \
	-out /etc/ssl/certs/nginx-selfsigned.crt \
	-subj "/CN=localhost"

COPY conf/conf.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /var/www/html

# Set permissions for Nginx directories
RUN chown -R nginxuser:nginxgroup /etc/nginx /var

# Switch to the non-root user
USER nginxuser

CMD [ "nginx", "-g", "daemon off;" ]