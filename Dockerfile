FROM node:12.16-buster-slim

RUN mkdir /app
WORKDIR /app
COPY . /app


RUN npm i --production

ENTRYPOINT ["node"]
CMD ["bin/www"]