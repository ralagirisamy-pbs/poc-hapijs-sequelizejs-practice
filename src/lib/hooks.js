const Boom = require("@hapi/boom");

/**
 * This method is called on onRequest event (right after request is received).
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const onRequestHandler = (request, h) => {
	console.log(`Incoming request for ${request.method.toUpperCase()} ${request.path}`);
	return h.continue;
};

/**
 * This method is called on onRequest event (right after request is received).
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const onPreHandler = (request, h) => {
	try {
		// Parse the incoming payload (will be in string) for POST and PUT methods.
		if (["post", "put"].includes(request.method)) {
			request.payload = JSON.parse(request.payload);
		}
		return h.continue;
	} catch (error) {
		throw Boom.badRequest("Invalid request payload");
	}
};

/**
 * This method is called on onPreResponse event (before response is sent to the client).
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const onPreResponseHandler = (request, h) => {
	if (Boom.isBoom(request.response)) {
		throw request.response;
	}
	return h.continue;
};

exports.plugin = {
	name: "lifecycleHooks",
	/**
	 * A handler to bind lifecycle hooks to the server.
	 * @param {*} server A Hapi server instance
	 */
	register: async (server) => {
		server.ext("onRequest", onRequestHandler);
		server.ext("onPreHandler", onPreHandler);
		server.ext("onPreResponse", onPreResponseHandler);
	}
};
