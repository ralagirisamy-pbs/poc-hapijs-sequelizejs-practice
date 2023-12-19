const hapi = require("@hapi/hapi");
const { DEFAULT_HOST, DEFAULT_PORT } = require("./src/_data/constants");

let server;

/**
 * Create and start the Hapi Server.
 */
const startServer = async () => {
	try {
		// Creating Hapi Server instance
		server = hapi.server({
			port: process.env.PORT || DEFAULT_PORT,
			host: process.env.HOST || DEFAULT_HOST
		});
		// Registering the required plugins for oute and lifecycle hooks.
		await server.register([require("./src/routes/employee"), require("./src/lib/hooks")]);
		// Starting the server.
		await server.start();
		console.info(`Server started on ${JSON.stringify(server.info.uri)}`);
	} catch (error) {
		console.error("Error while starting Hapi server: ", error.message);
		process.exit(1);
	}
};

if (process.env.NODE_ENV !== "test") {
	startServer();
}

/**
 * Stop the Hapi Server.
 */
const stopServer = async () => {
	try {
		// Wait for 10 secs to shutdown existing connections.
		await server?.stop({ timeout: 10 * 1000 });
		process.exit(0);
	} catch (error) {
		process.exit(1);
	}
};

// Handling terimate signal event
process.on("SIGINT", stopServer);
process.on("SIGTERM", stopServer);
