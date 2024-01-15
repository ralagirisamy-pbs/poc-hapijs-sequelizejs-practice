const InputData = require("../mock/input.json");

/**
 * Invoke GET /employee and return the response payload
 * @param {*} server Hapi.js Server instance.
 * @return {Promise<Object>} Response payload containing employees record.
 */
const getEmployeesValid = async (server) => {
	const options = {
		method: "GET",
		url: "/employees",
		headers: { Authorization: InputData.authToken.valid }
	};
	const response = await server.inject(options);
	return JSON.parse(response.payload || {});
};

module.exports = { getEmployeesValid };
