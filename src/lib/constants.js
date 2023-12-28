// constants: Uses this if env value is unavailable.
exports.DEFAULT_PORT = 3000;
exports.DEFAULT_HOST = "localhost";

// List of all properties in Employees table
exports.EMP_KEYLIST = ["name", "position", "team", "experience"];

// HTTP Response statuses
exports.HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
