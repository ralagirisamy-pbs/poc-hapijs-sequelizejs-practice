const { EMPLOYEE_FIELDS } = require("../../lib/constants");
const { ValidationError } = require("../../lib/error");

/**
 * Validate the payload for create employee API.
 * @param {object} payload Object containing employee data to be created.
 * @returns {Object} Payload for create Employee API.
 */
const formatPayloadForCreate = (payload) => {
  const employeeData = {};
  const missingKeyList = [];
  // Iterate through EMPLOYEE_FIELDS (employee properties) and check if payload has the property.
  EMPLOYEE_FIELDS.forEach((key) => {
    // If payload doesn't has the key, send 400 Bad request error response.
    if (!Object.hasOwnProperty.call(payload, key)) {
      missingKeyList.push(key);
    }
    // Add key value pair in newly created body.
    employeeData[key] = payload[key];
  });
  if (missingKeyList.length > 0) {
    throw new ValidationError(
      `Invalid payload: The payload should have the following ${
        missingKeyList.length > 1 ? "properties" : "property"
      } - (${missingKeyList.join(", ")}).`,
    );
  }
  // If payload has some other properties, throw Validation error.
  if (Object.keys(payload).length > EMPLOYEE_FIELDS.length) {
    throw new ValidationError(
      `Invalid payload: Payload contains unsupported fields. It should contain only the following fields: ${EMPLOYEE_FIELDS.join(
        ", ",
      )}`,
    );
  }
  return employeeData;
};

/**
 * Validate and format the payload for update employee API.
 * @param {object} payload Object containing employee data to be updated.
 * @returns {Object} Payload for update Employee API.
 */
const formatPayloadForUpdate = (payload) => {
  const employeeData = {};
  const missingKeyList = [];
  // Check if all the payload properties are valid. If not, send 400 bad request error.
  Object.keys(payload).forEach((key) => {
    if (EMPLOYEE_FIELDS.includes(key)) {
      employeeData[key] = payload[key];
    } else {
      missingKeyList.push(key);
    }
  });
  if (missingKeyList.length > 0) {
    throw new ValidationError(
      `Invalid payload: There are unsupported ${
        missingKeyList.length > 1 ? "properties" : "property"
      } - (${missingKeyList.join(", ")}).`,
    );
  }
  return employeeData;
};

/**
 * Verify the query params and return the formatted one.
 * @param {*} query The incoming query params from the user.
 * @return {Object} formatted query params.
 */
const formatQueryParamsForGet = (query) => {
  if (Object.keys(query).length === 0) {
    return {
      includeTasks: false,
    };
  }
  if (
    Object.keys(query).length > 1 ||
    (Object.keys(query).length === 1 && typeof query.includeTasks !== "string")
  ) {
    throw new ValidationError(
      "Validation failed: Unsupported query param/s. The only supported param is includeTasks",
    );
  }
  if (!["true", "false"].includes(query.includeTasks)) {
    throw new ValidationError(
      "Validation failed: Query param - includeTasks should either be 'true' or 'false'",
    );
  }
  return { includeTasks: query.includeTasks === "true" };
};

module.exports = {
  formatPayloadForCreate,
  formatPayloadForUpdate,
  formatQueryParamsForGet,
};
