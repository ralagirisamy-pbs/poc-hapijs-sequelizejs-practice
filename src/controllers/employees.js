const fs = require("fs/promises");
const path = require("path");
const Boom = require("@hapi/boom");
const { v4: uuid } = require("uuid");
const { HTTP_STATUS } = require("../_data/HttpStatus");
const validationService = require("../services/validation");

const employeesFilePath = path.join(__dirname, "../_data/employees.json");

/**
 * Read the json file and return the content.
 * @return {Array}
 */
const getEmployeesData = async () => {
	try {
		const data = await fs.readFile(employeesFilePath, "utf-8");
		return JSON.parse(data);
	} catch (error) {
		return [];
	}
};

/**
 * Get all Employees data.
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const getAllEmployees = async (request, h) => {
	const employeesData = await getEmployeesData();
	return h.response({ employees: employeesData });
};

/**
 * Get Employee data by ID.
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const getEmployeeById = async (request, h) => {
	const { id } = request.params;
	const employeesData = await getEmployeesData();
	const employee = employeesData.find((emp) => emp.id === id);
	return h.response({ employee: employee || {} });
};

/**
 * Create an Employee record.
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const createEmployee = async (request, h) => {
	const payload = request.payload;
	let formattedPayload = validationService.formatEmpCreatePayload(payload);
	formattedPayload["id"] = uuid();
	const employeesData = await getEmployeesData();
	employeesData.push(formattedPayload);
	// Write the updated content into the file
	await fs.writeFile(employeesFilePath, JSON.stringify(employeesData, null, 2), {
		encoding: "utf-8"
	});
	return h
		.response({
			status: HTTP_STATUS.CREATED,
			message: "Employee created successfully",
			data: formattedPayload
		})
		.code(HTTP_STATUS.CREATED);
};

/**
 * Update the Employee record.
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const updateEmployee = async (request, h) => {
	const payload = request.payload;
	const { id } = request.params;
	let formattedPayload = validationService.formatEmpUpdatePayload(payload);
	const employeesData = await getEmployeesData();
	let found = false;
	employeesData.forEach((employee) => {
		if (id === employee.id) {
			Object.keys(formattedPayload).forEach((key) => {
				employee[key] = formattedPayload[key];
			});
			// Set the flag true
			found = true;
		}
	});
	// A flag to denote record is found and updated.
	if (!found) {
		throw Boom.notFound(`Employee - ${id} not found`);
	}
	// Write the updated content into the file
	await fs.writeFile(employeesFilePath, JSON.stringify(employeesData, null, 2), {
		encoding: "utf-8"
	});
	return h
		.response({
			status: HTTP_STATUS.CREATED,
			message: "Employee updated successfully",
			data: formattedPayload
		})
		.code(HTTP_STATUS.CREATED);
};

/**
 * Delete the Employee of the given ID.
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const deleteEmployee = async (request, h) => {
	const { id } = request.params;
	const employeesData = await getEmployeesData();
	const index = employeesData.findIndex((emp) => emp.id === id);
	if (index === -1) {
		throw Boom.notFound(`Employee - ${id} not found`);
	}
	employeesData.splice(index, 1);
	// Write the updated content into the file
	await fs.writeFile(employeesFilePath, JSON.stringify(employeesData, null, 2), {
		encoding: "utf-8"
	});
	return h
		.response({
			status: HTTP_STATUS.OK,
			message: "Employee deleted successfully"
		})
		.code(HTTP_STATUS.OK);
};

module.exports = {
	getAllEmployees,
	getEmployeeById,
	createEmployee,
	updateEmployee,
	deleteEmployee
};
