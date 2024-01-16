const InputData = require("../mock/input.json");

/**
 * Invoke GET /employee and return the response payload
 * @param {object} server Hapi.js Server instance.
 * @param {string} queryParams URL query params.
 * @return {Promise<object>} Response payload containing employees record.
 */
const getEmployeesValid = async (server, queryParams = "") => {
	const options = {
		method: "GET",
		url: `/employees?${queryParams}`,
		headers: { Authorization: InputData.authToken.valid }
	};
	const response = await server.inject(options);
	return JSON.parse(response.payload || {});
};

module.exports = { getEmployeesValid };
