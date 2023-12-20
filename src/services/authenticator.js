const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../lib/error");

/**
 * This method is called on onPreAuth event (right before authentication is carried out).
 * @param {Object} request - Request Object with all input details
 * @param {Object} h - h Object with required functions to write server responses
 */
const authHandler = (request, h) => {
  try {
    const { authorization } = request.headers;
    if (!authorization) {
      throw new UnauthorizedError(
        "Authentication failed: No Authorization header",
      );
    }
    // Extract token from the bearer header.
    const token = authorization.split(" ")[1];
    // Verify the incoming jwt token and extract the payload.
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // validate the payload.
    if (payload.user !== "admin" || payload.scope !== "all") {
      throw new UnauthorizedError(
        "Authorization failed: Don't have access to the resource.",
      );
    }
    return h.continue;
  } catch (error) {
    console.error("Authentication failed. Error: ", error.message);
    throw new UnauthorizedError(error.message ?? "Authentication failed!");
  }
};

module.exports = {
  authHandler,
};
