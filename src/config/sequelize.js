const Sequelize = require("sequelize");
// eslint-disable-next-line no-unused-vars
const pg = require("pg");
const HapiSequelize = require("hapi-sequelizejs");
const path = require("path");

/**
 * Create Sequelize instance and register into the Hapi server instance.
 * @param {Object} server Hapi server instance
 */
const registerSequelize = async (server) => {
  const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      dialect: "postgres",
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    },
  );
  await server.register({
    plugin: HapiSequelize,
    options: [
      {
        name: process.env.DB_DATABASE,
        models: [path.join(__dirname, "../models/*.js").replaceAll(/\\/g, "/")],
        sequelize,
        // sync: true,
      },
    ],
  });
};

module.exports = { registerSequelize };
