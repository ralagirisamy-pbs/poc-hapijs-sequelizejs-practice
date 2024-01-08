const { HTTP_STATUS } = require("../lib/constants");
const validationService = require("../services/validation");
const { NotFoundError, ValidationError } = require("../lib/error");
const employeeDbService = require("../services/db/employees");

/**
 * Get all Employees data.
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const getAllEmployees = async (request, h) => {
  try {
    const models = request.getDb().getModels();
    const employeeRecords = await employeeDbService.getEmployees(
      models.Employee,
    );
    if (employeeRecords.length === 0) {
      throw new NotFoundError(`No Employees found`);
    }
    return h
      .response({
        statusCode: HTTP_STATUS.OK,
        data: employeeRecords,
      })
      .code(HTTP_STATUS.OK);
  } catch (error) {
    console.error("Error caught at getAllEmployees:", error);
    if (error.name) {
      throw error;
    }
    throw Error("Internal Server error: Couldn't get the employees");
  }
};

/**
 * Get Employee data by ID.
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const getEmployeeById = async (request, h) => {
  const { params } = request;
  try {
    const models = request.getDb().getModels();
    const id = parseInt(params.id, 10);
    if (!id) {
      throw new ValidationError(
        `Validation failed: Invalid employee id - ${params.id}`,
      );
    }
    const employeeRecord = await employeeDbService.getEmployeeById(
      id,
      models.Employee,
    );
    if (!employeeRecord) {
      throw new NotFoundError(`Employee - ${id} not found`);
    }
    return h
      .response({ statusCode: HTTP_STATUS.OK, data: employeeRecord })
      .code(HTTP_STATUS.OK);
  } catch (error) {
    console.error("Error caught at getEmployeeById:", error);
    if (error.name) {
      throw error;
    }
    throw Error(
      `Internal Server error: Couldn't get the employee - ${params.id}`,
    );
  }
};

/**
 * Create an Employee record.
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const createEmployee = async (request, h) => {
  try {
    const { payload } = request;
    const formattedPayload = validationService.formatPayloadForCreate(payload);
    const models = request.getDb().getModels();
    const employeeRecord = await employeeDbService.createEmployee(
      formattedPayload,
      models.Employee,
    );
    return h
      .response({
        statusCode: HTTP_STATUS.CREATED,
        message: "Employee created successfully",
        data: employeeRecord,
      })
      .code(HTTP_STATUS.CREATED);
  } catch (error) {
    console.error("Error caught at createEmployee:", error);
    if (error.name) {
      throw error;
    }
    throw Error(`Internal Server error: Couldn't create the employee`);
  }
};

/**
 * Update the Employee record.
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const updateEmployee = async (request, h) => {
  const { params } = request;
  try {
    const { payload } = request;
    const id = parseInt(params.id, 10);
    if (!id) {
      throw new ValidationError(
        `Validation failed: Invalid employee id - ${params.id}`,
      );
    }
    const formattedPayload = validationService.formatPayloadForUpdate(payload);
    const models = request.getDb().getModels();
    const response = await employeeDbService.updateEmployee(
      id,
      formattedPayload,
      models.Employee,
    );
    if (response[0] === 0) {
      throw new NotFoundError(`Employee - ${params.id} not found`);
    }
    return h
      .response({
        statusCode: HTTP_STATUS.CREATED,
        message: "Employee updated successfully",
        data: response[1],
      })
      .code(HTTP_STATUS.CREATED);
  } catch (error) {
    console.error("Error caught at updateEmployee:", error);
    if (error.name) {
      throw error;
    }
    throw Error(
      `Internal Server error: Couldn't update the employee - ${params.id}`,
    );
  }
};

/**
 * Delete the Employee of the given ID.
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const deleteEmployee = async (request, h) => {
  const { params } = request;
  try {
    const models = request.getDb().getModels();
    const id = parseInt(params.id, 10);
    if (!id) {
      throw new ValidationError(
        `Validation failed: Invalid employee id - ${params.id}`,
      );
    }
    const response = await employeeDbService.deleteEmployee(
      id,
      models.Employee,
    );
    if (response === 0) {
      throw new NotFoundError(`Employee - ${params.id} not found`);
    }
    return h
      .response({
        statusCode: HTTP_STATUS.OK,
        message: "Employee deleted successfully",
      })
      .code(HTTP_STATUS.OK);
  } catch (error) {
    console.error("Error caught at deleteEmployee:", error);
    if (error.name) {
      throw error;
    }
    throw Error(
      `Internal Server error: Couldn't delete the employee - ${params.id}`,
    );
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
