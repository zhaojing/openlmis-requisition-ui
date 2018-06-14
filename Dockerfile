FROM debian:jessie

WORKDIR /openlmis-requisition-ui

COPY package.json .
COPY package-yarn.json .
COPY config.json .
COPY src/ ./src/
COPY build/messages/ ./messages/