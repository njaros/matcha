FROM nginx

RUN apt-get update && apt-get install -y vim iputils-ping

COPY ./proxy_params /etc/nginx/proxy_params
COPY	./tools/certCA/certCA.pem /usr/local/share/ca-certificates/certCA.pem
COPY	./tools/certCA/certCA.key /usr/local/share/ca-certificates/certCA.key
COPY	./tools/certCA/myX509.ext /certCA_utils/myX509.ext

RUN		update-ca-certificates

RUN		openssl genrsa -out /etc/ssl/private/nginx.key 2048

RUN		openssl req -new -key /etc/ssl/private/nginx.key -out ./certCA_utils/inception.csr -subj "/C=FR/ST=Lyon/L=Villeurbanne/CN=Nicolas/emailAddress=nicolas.jaros@proton.me"

RUN		echo "I hate passwords" | openssl x509 -req -in ./certCA_utils/inception.csr -CA /usr/local/share/ca-certificates/certCA.pem -CAkey /usr/local/share/ca-certificates/certCA.key -CAcreateserial -out /etc/ssl/certs/nginx.crt -days 825 -sha256 -extfile /certCA_utils/myX509.ext
