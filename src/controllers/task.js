const { HTTP_STATUS } = require("../lib/constants");
const {
  formatPayloadForCreate,
  formatPayloadForUpdate,
  validateAssignedEmployee,
} = require("../services/validations/task");
const { NotFoundError, ValidationError } = require("../lib/error");
const dbHandler = require("../services/db-handler");

/**
 * Get all Task data.
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const getAllTasks = async (request, h) => {
  try {
    const models = request.getDb().getModels();
    const taskRecords = await dbHandler.getRecords(models.Task);
    if (taskRecords.length === 0) {
      throw new NotFoundError(`No Task found`);
    }
    return h
      .response({
        statusCode: HTTP_STATUS.OK,
        data: taskRecords,
      })
      .code(HTTP_STATUS.OK);
  } catch (error) {
    console.error("Error caught at getAllTasks:", error);
    if (error.name) {
      throw error;
    }
    throw Error("Internal Server error: Couldn't get tasks");
  }
};

/**
 * Get Task data by ID.
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const getTaskById = async (request, h) => {
  const { params } = request;
  try {
    const models = request.getDb().getModels();
    const id = parseInt(params.id, 10);
    if (!id) {
      throw new ValidationError(
        `Validation failed: Invalid task id - ${params.id}`,
      );
    }
    const taskRecord = await dbHandler.getRecordById(id, models.Task);
    if (!taskRecord) {
      throw new NotFoundError(`Task - ${id} not found`);
    }
    return h
      .response({ statusCode: HTTP_STATUS.OK, data: taskRecord })
      .code(HTTP_STATUS.OK);
  } catch (error) {
    console.error("Error caught at getTaskById:", error);
    if (error.name) {
      throw error;
    }
    throw Error(`Internal Server error: Couldn't get the task - ${params.id}`);
  }
};

/**
 * Create an Task record.
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const createTask = async (request, h) => {
  try {
    const { payload } = request;
    const formattedPayload = formatPayloadForCreate(payload);
    const models = request.getDb().getModels();
    // Verify the assiciated employee
    await validateAssignedEmployee(
      formattedPayload.assigned_employee_id,
      models.Employee,
    );
    const taskRecord = await dbHandler.createRecord(
      formattedPayload,
      models.Task,
    );
    return h
      .response({
        statusCode: HTTP_STATUS.CREATED,
        message: "Task created successfully",
        data: taskRecord,
      })
      .code(HTTP_STATUS.CREATED);
  } catch (error) {
    console.error("Error caught at createTask:", error);
    if (error.name) {
      throw error;
    }
    throw Error(`Internal Server error: Couldn't create the task`);
  }
};

/**
 * Update the Task record.
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const updateTask = async (request, h) => {
  const { params } = request;
  try {
    const { payload } = request;
    const id = parseInt(params.id, 10);
    if (!id) {
      throw new ValidationError(
        `Validation failed: Invalid task id - ${params.id}`,
      );
    }
    const formattedPayload = formatPayloadForUpdate(payload);
    const models = request.getDb().getModels();
    // Verify the assiciated employee
    await validateAssignedEmployee(
      formattedPayload.assigned_employee_id,
      models.Employee,
    );
    const response = await dbHandler.updateRecord(
      id,
      formattedPayload,
      models.Task,
    );
    if (response[0] === 0) {
      throw new NotFoundError(`Task - ${params.id} not found`);
    }
    return h
      .response({
        statusCode: HTTP_STATUS.CREATED,
        message: "Task updated successfully",
        data: response[1],
      })
      .code(HTTP_STATUS.CREATED);
  } catch (error) {
    console.error("Error caught at updateTask:", error);
    if (error.name) {
      throw error;
    }
    throw Error(
      `Internal Server error: Couldn't update the task - ${params.id}`,
    );
  }
};

/**
 * Delete the Task of the given ID.
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const deleteTask = async (request, h) => {
  const { params } = request;
  try {
    const models = request.getDb().getModels();
    const id = parseInt(params.id, 10);
    if (!id) {
      throw new ValidationError(
        `Validation failed: Invalid task id - ${params.id}`,
      );
    }
    const response = await dbHandler.deleteRecord(id, models.Task);
    if (response === 0) {
      throw new NotFoundError(`Task - ${params.id} not found`);
    }
    return h
      .response({
        statusCode: HTTP_STATUS.OK,
        message: "Task deleted successfully",
      })
      .code(HTTP_STATUS.OK);
  } catch (error) {
    console.error("Error caught at deleteTask:", error);
    if (error.name) {
      throw error;
    }
    throw Error(
      `Internal Server error: Couldn't delete the task - ${params.id}`,
    );
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
