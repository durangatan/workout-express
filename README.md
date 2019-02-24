# Workout App REST API

REST JSON API built with Express.js and MySql.

Uses the controller -> service -> repository pattern.

## Dev

`npm run dev`

Compiles the Typescript and starts the server.

## Test

`npm test`

There are currently no tests.

## Build

`npm run build`

Compiles the Typescript into `./dist`

## Start

`npm run start`

Starts the server. Assumes the app has been built.

## DB Commands

`npm run db:create`

Builds the app and runs the database creation script including table schema.

`npm run db:seed`

Builds the app and runs the database seeding script.

`npm run db:drop`
Builds the app and drops the database. Requires command-line confirmation.

## Deploy Commands

`npm run deploy`

The `docker-compose` configuration for this project creates a mysql Docker container and a node.js Docker container and links them.
Once the command exits, you can run db scripts for the newly created database using commands like `docker-compose exec db npm run db:create`. 