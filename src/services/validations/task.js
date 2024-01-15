const {
  TASK_FIELDS,
  MANDATORY_TASK_FIELDS,
  PRIORITY_ENUM,
} = require("../../lib/constants");
const { ValidationError } = require("../../lib/error");
const dbHandler = require("../db-handler");

/**
 * Validate the Priority value.
 * @param {Object} payload Incoming payload
 */
const validatePriority = (payload) => {
  // Validate Priority field value
  if (payload.priority) {
    if (!PRIORITY_ENUM.includes(payload.priority)) {
      throw new ValidationError(
        "Invalid payload: Priority value should be amoung any of these value - ('Low', 'Medium', 'High')",
      );
    }
  }
};
/**
 * Validate the payload for create task API.
 * @param {object} payload Object containing task data to be created.
 * @returns {Object} Payload for create Task API.
 */
const formatPayloadForCreate = (payload) => {
  const taskData = {};
  const unsupportedFields = [];
  const missingFields = [];
  // Iterate through mandatory task fields and check if payload has the property.
  MANDATORY_TASK_FIELDS.forEach((key) => {
    // If payload doesn't has the key, send 400 Bad request error response.
    if (!Object.hasOwnProperty.call(payload, key)) {
      missingFields.push(key);
    }
  });
  if (missingFields.length > 0) {
    throw new ValidationError(
      `Invalid payload: The payload should have the following ${
        missingFields.length > 1 ? "properties" : "property"
      } - (${missingFields.join(", ")}).`,
    );
  }
  // Filter the supported fields
  Object.keys(payload).forEach((key) => {
    if (TASK_FIELDS.includes(key)) {
      taskData[key] = payload[key];
    } else {
      unsupportedFields.push(key);
    }
  });
  // If payload has some unsupported fields, throw Validation error.
  if (Object.keys(unsupportedFields).length > 0) {
    throw new ValidationError(
      `Invalid payload: Payload contains unsupported fields - (${unsupportedFields.join(
        ", ",
      )}). It should contain only the following fields: ${TASK_FIELDS.join(
        ", ",
      )}`,
    );
  }
  validatePriority(payload);
  // Convert Labels into array if it is a string
  if (typeof payload.labels === "string") {
    taskData.labels = [payload.labels];
  }
  return taskData;
};

/**
 * Validate and format the payload for update task API.
 * @param {object} payload Object containing task data to be updated.
 * @returns {Object} Payload for update Employee API.
 */
const formatPayloadForUpdate = (payload) => {
  const taskData = {};
  const unsupportedFields = [];
  // Filter out the supported fields.
  Object.keys(payload).forEach((key) => {
    if (TASK_FIELDS.includes(key)) {
      taskData[key] = payload[key];
    } else {
      unsupportedFields.push(key);
    }
  });
  // If payload has some unsupported fields, throw Validation error.
  if (unsupportedFields.length > 0) {
    throw new ValidationError(
      `Invalid payload: There are unsupported ${
        unsupportedFields.length > 1 ? "properties" : "property"
      } - (${unsupportedFields.join(", ")}).`,
    );
  }
  validatePriority(payload);
  // Convert Labels into array if it is a string
  if (typeof payload.labels === "string") {
    taskData.labels = [payload.labels];
  }
  return taskData;
};

/**
 * Verify if the employeeId is available in Employee table or not.
 * @param {string} employeeId Employee id
 * @param {Object} EmployeeModel Sequelize model for Employee table
 */
const validateAssignedEmployee = async (employeeId, EmployeeModel) => {
  if (employeeId) {
    const employeeResponse = await dbHandler.getRecordById(
      employeeId,
      EmployeeModel,
    );
    if (!employeeResponse) {
      throw new ValidationError(
        "Invalid payload: No Employee matches the assigned_employee_id value.",
      );
    }
  }
};

module.exports = {
  formatPayloadForCreate,
  formatPayloadForUpdate,
  validateAssignedEmployee,
};
