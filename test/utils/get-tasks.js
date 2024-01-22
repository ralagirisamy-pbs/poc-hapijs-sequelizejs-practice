const InputData = require("../mock/input.json");

/**
 * Invoke GET /task and return the response payload
 * @param {*} server Hapi.js Server instance.
 * @param {string} queryParams URL query params.
 * @return {Promise<Object>} Response payload containing tasks record.
 */
const getTasksValid = async (server, queryParams = "") => {
	const options = {
		method: "GET",
		url: `/tasks?${queryParams}`,
		headers: { Authorization: InputData.authToken.valid }
	};
	const response = await server.inject(options);
	return JSON.parse(response.payload || {});
};

module.exports = { getTasksValid };
