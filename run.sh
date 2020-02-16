#!/bin/bash
IMAGE=myguddy/sam-blackberry-api:$1
LATEST=myguddy/sam-blackberry-api:latest
echo "docker build . -t "$IMAGE

docker build . -t $IMAGE
docker tag $IMAGE $LATEST
docker push $IMAGE
docker push $LATEST