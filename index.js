const hapi = require("@hapi/hapi");

// constants: Uses this if env value is unavailable.
const DEFAULT_PORT = 3000;
const DEFAULT_HOST = "localhost";

(async function () {
	// Creating Hapi Server instance
	const server = hapi.server({
		port: process.env.PORT || DEFAULT_PORT,
		host: process.env.HOST || DEFAULT_HOST
	});
	// Registering the required plugins for oute and lifecycle hooks.
	await server.register([require("./src/routes/employee"), require("./src/lib/hooks")]);
	// Starting the server.
	await server.start();
	console.info(`Server started on ${JSON.stringify(server.info.uri)}`);
})();
