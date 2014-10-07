From phusion/baseimage:latest
MAINTAINER Philipz <philipzheng@gmail.com>

# Install NodeJS
RUN apt-get -qq update && apt-get -y upgrade
RUN apt-get install -y nodejs
RUN apt-get install -y npm
# Install Library
RUN npm install mqtt
RUN npm install influx
RUN npm install mime-types

RUN mkdir /etc/service/mqtt
ADD mqtt.sh /etc/service/mqtt/run
RUN chmod +x /etc/service/mqtt/run
RUN mkdir /MQTT
ADD mqtt2influx.js /MQTT/
CMD ["/sbin/my_init"]
