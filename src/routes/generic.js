const Fallbacks = require("../controllers/fallback");

exports.plugin = {
  name: "genericRouter",
  /**
   * A handler to bind routes to the server.
   * @param {*} server A Hapi server instance
   */
  register: async (server) => {
    server.route([{ method: "*", path: "/{p*}", handler: Fallbacks.notFound }]);
  },
};
