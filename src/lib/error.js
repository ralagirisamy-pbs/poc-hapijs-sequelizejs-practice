/* eslint-disable max-classes-per-file */

/**
 * Class representing and holding details about errors when fetching an unavailable entity
 * @class NotFoundError
 * @extends {Error}
 */
class NotFoundError extends Error {
  /**
   * Creates an instance of NotFoundError if the resource is not available.
   * @param {*} message An error message for user.
   * @memberof NotFoundError
   */
  constructor(message) {
    super(message);
    this.name = "DataNotFoundError";
    this.message = message;
  }
}

/**
 * Class representing and holding details about payload validation errors
 * @class ValidationError
 * @extends {Error}
 */
class ValidationError extends Error {
  /**
   * Creates an instance of ValidationError.
   * It handles all the validation related to payload for POST or PUT operation.
   * @param {*} message A detailed error message where the validation failed.
   * @memberof ValidationError
   */
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.message = message;
  }
}

/**
 * Class representing and holding details about payload validation errors
 * @class ValidationError
 * @extends {Error}
 */
class UnauthorizedError extends Error {
  /**
   * Creates an instance of UnauthorizedError.
   * It is created on authentication failure.
   * @param {*} message An error message for user reference.
   * @memberof UnauthorizedError
   */
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.message = message;
  }
}

/**
 * The 'unhandledRejection' event is emitted whenever a Promise is rejected and
 * no error handler is attached to the promise within a turn of the event loop.
 * Here, without exiting the process, we are logging the exception for analysis and keeping the process alive.
 * @param   {Object} err      The object with which the promise was rejected
 * @param   {Object} promise  The rejected promise.
 */
process.on("unhandledRejection", (reason, promise) => {
  console.error(`Unhandled Rejection at: ${promise} reason: ${reason}`);
});

/**
 * The 'uncaughtException' event is emitted when an uncaught JavaScript exception bubbles all the way back to the event loop.
 * By default, Node.js handles such exceptions by printing the stack trace to stderr and exiting with code 1,
 * overriding any previously set process.exitCode.
 * Adding a handler for the 'uncaughtException' event overrides this default behavior
 * Here, without exiting the process, we are logging the exception for analysis and keeping the process alive.
 * @param   {Object} err    The uncaught exception
 * @param   {Object} origin  Indicates if the exception originates from an unhandled rejection or from an synchronous error
 */
process.on("uncaughtException", (err, origin) => {
  console.error(`Caught exception: ${err}\n Exception origin: ${origin}`);
});

module.exports = {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
};
