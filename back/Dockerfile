# Dockerfile source https://www.kilukru.dev/construire-et-deployer-une-application-flask-a-laide-de-docker/
# start by pulling the python image
FROM python:alpine
 
# copy the requirements file into the image
COPY ./requirements.txt /app/requirements.txt
 
# switch working directory
WORKDIR /app
 
# install the dependencies and packages in the requirements file
RUN apk add build-base & \
	pip install -r requirements.txt
 
# copy every content from the local file to the image
COPY . /app

# configure the container to run in an executed manner
ENTRYPOINT [ "python" ]
 
CMD ["api.py" ]