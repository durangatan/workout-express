FROM node:latest
ENV MYSQL_ROOT_PASSWORD=secret123
ENV MYSQL_DATABASE=WORKOUT
RUN mkdir /server
WORKDIR /server
COPY package*.json /server/
COPY tsconfig.json /server/
COPY src/ /server/src
RUN npm install
EXPOSE 3001
