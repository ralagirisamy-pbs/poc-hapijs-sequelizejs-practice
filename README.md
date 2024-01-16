# Learning Hapi.js & Sequelize.js

A simple Hapi.js server application to learn the fundamental concepts of Hapi.js and Sequelize.js.

## Scope of the learning

- Routes, Requests and Responses
- Plugins and Modularization
- Integrating Sequelize for database interaction
- Error Handling
- Authentication and Security
- Testing

### Application workflow

- The application is built on the Hapi.js framework with sequelize for interacting with the Postgresql database.
- Through the application, we can create, fetch, update and delete employees and their respective tasks.

### Token generation

To create JWT token follow the below steps,
- Go to https://jwt.io/ and fill the right section with the following values,
- Payload should be,
```
{
  "user": "admin",
  "scope": "all"
}
```
- Header should be,
```
{
  "alg": "HS256",
  "typ": "JWT"
}
```
- secret should be `practicehapijsandsequelizejs`
- Once the necessary values are given, copy the token displayed in the left pane. Use it as Bearer token. Eg. `authorization: "Bearer <token>"`

### Environment variables

All the available variables are,
- *PORT* - Hapi.js Server port
- *HOST* - Hapi.js Server host
- *JWT_SECRET* - jwt secret to encode and decode tokens.
- *DB_DATABASE* - Postgres database name
- *DB_SCHEMA* - Postgres database schema
- *DB_USERNAME* - Postgres database username
- *DB_PASSWORD* - Postgres database password
- *DB_HOST* - Postgres database hostname on which it is currently running
- *DB_PORT* - Postgres database port on which it is currently running

### API Routes

#### Employee API
  1. **GET /employees** - Fetch all the employees record.
  1. **GET /employee/{id}** - Fetch the employee record matching the id.
  1. **POST /employee** - Create the employee record.
  1. **PUT /employee/{id}** - Update the matching employee record.
  1. **DELETE /employee/{id}** - Delete the matching employee record.

#### Task API
  1. **GET /tasks** - Fetch all the tasks record.
  1. **GET /task/{id}** - Fetch the task record matching the id.
  1. **POST /task** - Create the task record.
  1. **PUT /task/{id}** - Update the matching task record.
  1. **DELETE /task/{id}** - Delete the matching task record.

### How to Run
To run the application locally, do the following steps,
- Checkout the code.
- Install required dependencies using `npm install`.
- Create `.env` file and add necessary environment variables. Refer to #Environment variables section for all possible variables.
- Run the Postgres database in either localhost/respective server.
- Create the Schema and necessary table in the db using the .sql file available in (*resources\company-db.sql*).
- On the root directory, run the application using `npm run dev` or `npm run start`.
- Refer to the Postman collections available on resource folder (*resources\Employee-portal.postman_collection.json*) for testing out the API.
- Authorization token is required for all operation. Refer #Token generation for creating token.
