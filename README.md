# POC: Learning Hapi.js & Sequelize.js
Created a simple Hapi.js server application to learn the same and Sequelize.js.

## Scope of the learning
- Routes, Requests and Responses
- Plugins and Modularization
- Error Handling
- Authentication and Security
- Testing

### Application workflow
- The application is built on Hapi.js framework.
- In the app, we can do CRUD operation on employee informations like create, get, get all, update and delete.
- The employee record will contain following properties,
    1. name
    1. position
    1. team
    1. experience

### Important facts:

- Validating the user input is a vast area. The application will not cover all the complex validations in order to focus on the main aspects.Below are the list the app can and cannot do.
- #### Can
    - Check for invalid properties.
    - Check for missing properties in terms of POST operations.
- #### Cannot
    - Doesn't check the property types (if it )
