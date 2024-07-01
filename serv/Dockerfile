FROM nginx

RUN apt-get update && apt-get install -y vim iputils-ping

COPY ./proxy_params /etc/nginx/proxy_params