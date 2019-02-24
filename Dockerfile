FROM node:latest
RUN mkdir /server
WORKDIR /server
COPY package*.json /server/
COPY tsconfig.json /server/
COPY src/ /server/src
RUN npm install
EXPOSE 3001
