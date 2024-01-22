require("dotenv").config();
const hapi = require("@hapi/hapi");
const { DEFAULT_HOST, DEFAULT_PORT } = require("./lib/constants");
const EmployeeRoute = require("./routes/employee");
const TaskRoute = require("./routes/task");
const GenericRoute = require("./routes/generic");
const LifecycleHooks = require("./lib/hooks");
const { registerSequelize } = require("./config/sequelize");

let server;

/**
 * Create and start the Hapi Server.
 */
const startServer = async () => {
  try {
    // Creating Hapi Server instance
    server = hapi.server({
      port: process.env.PORT || DEFAULT_PORT,
      host: process.env.HOST || DEFAULT_HOST,
    });
    // Registering the required plugins for oute and lifecycle hooks.
    await server.register([
      EmployeeRoute,
      TaskRoute,
      GenericRoute,
      LifecycleHooks,
    ]);
    // register Sequelize instance
    await registerSequelize(server);
    // Default authentication strategy
    server.auth.default();
    // Starting the server.
    await server.start();
    console.info(`Server started on ${JSON.stringify(server.info.uri)}`);
    return server;
  } catch (error) {
    console.error("Error while starting Hapi server: ", error.message);
    return process.exit(1);
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

module.exports = {
  startServer,
};
