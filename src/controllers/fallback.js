const { NotFoundError } = require("../lib/error");

/**
 * For any other routes, send .
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const notFound = (request, h) => {
	throw new NotFoundError("API route not available");
};

module.exports = {
	notFound
};
