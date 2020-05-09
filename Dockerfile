FROM nginx:alpine

RUN apk update && apk add ruby-dev nginx npm build-base libffi-dev
RUN npm install -g grunt-cli && gem install sass

COPY . /usr/share/nginx/html

RUN cd /usr/share/nginx/html/assets/js && npm install && grunt

EXPOSE 80
