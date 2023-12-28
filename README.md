# Learning Hapi.js & Sequelize.js

A simple Hapi.js server application to learn the fundamental concepts of Hapi.js and Sequelize.js.

## Scope of the learning

- Routes, Requests and Responses
- Plugins and Modularization
- Error Handling
- Authentication and Security
- Testing

### Application workflow

- The application is built on the Hapi.js framework.
- In the app, we can do CRUD operations on employee information like create, get, get all, update and delete.
- The employee record will contain the following properties,
    1. name
    1. position
    1. team
    1. experience

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

### API Routes

- Supported API routes are
    1. **GET /employees** - Fetch all the employees record.
    1. **GET /employee/{id}** - Fetch the employee record matching the id.
    1. **POST /employee** - Create the employee record.
    1. **PUT /employee/{id}** - Update the matching employee record.
    1. **DELETE /employee/{id}** - Delete the matching employee record.

### How to Run
To run the application locally, do the following steps,
- Checkout the code.
- Install required dependencies using `npm install`.
- Create `.env` file and add necessary environment variables. Refer to #Environment variables section for all possible variables.
- Go to the root ,
- On the root directory, run the application using `npm run dev` or `npm run start`.
- Refer to the Postman collections available on resource folder (*resources\Employee-portal.postman_collection.json*) for testing out the API.
- Authorization token is required for all operation. Refer #Token generation for creating token.
