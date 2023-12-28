const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../lib/error");

/**
 * Verify and extract the jwt token.
 * @param {String} authorization Authorization header
 * @return {Promise<Object>} Decrypted payload of the token
 */
const extractToken = (authorization) => {
  try {
    // Extract token from the bearer header.
    const token = authorization.split(" ")[1];
    // Verify the incoming jwt token and return the extracted payload.
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.log("Error while extracting token. Error: ", error.message);
    throw Error("Authentication failed: Invalid token");
  }
};

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
    const payload = extractToken(authorization);
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
