const Boom = require("@hapi/boom");
const { EMP_KEYLIST } = require("../_data/employee");

/**
 * Validate and format the payload for create employee API.
 * @param {object} payload Object containing employee data to be created.
 */
const formatEmpCreatePayload = (payload) => {
	let employeeData = {};
	// Iterate through EMP_KEYLIST (employee properties) and check if payload has the property.
	EMP_KEYLIST.forEach((key) => {
		// If payload doesn't has the key, send 400 Bad request error response.
		if (!payload.hasOwnProperty(key)) {
			throw Boom.badRequest(`Invalid payload: Property - ${key} is missing.`);
		}
		// Add key value pair in newly created body.
		employeeData[key] = payload[key];
	});
	// If payload properties length doesn't match with EMP_KEYLIST.length,
	// either new properties are there or some properties are missing.
	if (Object.keys(payload).length != EMP_KEYLIST.length) {
		throw Boom.badRequest(
			`Invalid payload: Payload should contain the following fields: ${EMP_KEYLIST}`
		);
	}
	return employeeData;
};

/**
 * Validate and format the payload for update employee API.
 * @param {object} payload Object containing employee data to be updated.
 */
const formatEmpUpdatePayload = (payload) => {
	let employeeData = {};
	// Check if all the payload properties are valid. If not, send 400 bad request error.
	Object.keys(payload).forEach((key) => {
		if (EMP_KEYLIST.includes(key)) {
			employeeData[key] = payload[key];
		} else {
			throw Boom.badRequest(`Invalid payload: Property - ${key} is missing.`);
		}
	});
	return employeeData;
};

module.exports = {
	formatEmpCreatePayload,
	formatEmpUpdatePayload
};
