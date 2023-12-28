const { NotFoundError } = require("../lib/error");

/**
 * Wildcard route handler.
 */
const notFound = () => {
  throw new NotFoundError("API route not available");
};

module.exports = {
  notFound,
};
