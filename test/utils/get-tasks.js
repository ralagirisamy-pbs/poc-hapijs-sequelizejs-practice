const InputData = require("../mock/input.json");

/**
 * Invoke GET /task and return the response payload
 * @param {*} server Hapi.js Server instance.
 * @return {Promise<Object>} Response payload containing tasks record.
 */
const getTasksValid = async (server) => {
	const options = {
		method: "GET",
		url: "/tasks",
		headers: { Authorization: InputData.authToken.valid }
	};
	const response = await server.inject(options);
	return JSON.parse(response.payload || {});
};

module.exports = { getTasksValid };
