const { EMP_KEYLIST } = require("../lib/constants");
const { ValidationError } = require("../lib/error");

/**
 * Validate the payload for create employee API.
 * @param {object} payload Object containing employee data to be created.
 * @returns {Object} Payload for create Employee API.
 */
const formatPayloadForCreate = (payload) => {
  const employeeData = {};
  const missingKeyList = [];
  // Iterate through EMP_KEYLIST (employee properties) and check if payload has the property.
  EMP_KEYLIST.forEach((key) => {
    // If payload doesn't has the key, send 400 Bad request error response.
    if (!Object.hasOwnProperty.call(payload, key)) {
      missingKeyList.push(key);
    }
    // Add key value pair in newly created body.
    employeeData[key] = payload[key];
  });
  if (missingKeyList.length > 0) {
    throw new ValidationError(
      `Invalid payload: There are missing ${
        missingKeyList.length > 1 ? "properties" : "property"
      } - (${missingKeyList.join(", ")}).`,
    );
  }
  // If payload has some other properties, throw Validation error.
  if (Object.keys(payload).length > EMP_KEYLIST.length) {
    throw new ValidationError(
      `Invalid payload: Payload contains unsupported fields. It should contain only the following fields: ${EMP_KEYLIST.join(
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
    if (EMP_KEYLIST.includes(key)) {
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

module.exports = {
  formatPayloadForCreate,
  formatPayloadForUpdate,
};
