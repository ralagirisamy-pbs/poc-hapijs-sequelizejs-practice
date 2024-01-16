const { SORT_ORDER_LIST } = require("../../lib/constants");
const { employeeAssociationQuery } = require("../../lib/constants");
const { ValidationError } = require("../../lib/error");

/**
 * Validate the query params and return the formatted one.
 * @param {object} query The incoming query params from the user.
 * @return {object} formatted query params.
 */
const validateQueryParams = (query) => {
  const formattedQuery = {};
  // If includeTasks query present, irrespective of the value, send the associated task data.
  if (typeof query.includeTasks === "string") {
    Object.assign(formattedQuery, employeeAssociationQuery);
  }
  // Process the query param - orderBy
  if (query.orderBy) {
    const orderBy = query.orderBy.toLowerCase();
    if (!SORT_ORDER_LIST[orderBy]) {
      throw new ValidationError(
        "Validation failed: Query - orderBy should be either 'newestFirst' or 'oldestFirst'",
      );
    }
    // Append or add sorting order configuration
    formattedQuery.order = formattedQuery.order
      ? [...formattedQuery.order, SORT_ORDER_LIST[orderBy]]
      : [SORT_ORDER_LIST[orderBy]];
  }
  // Process the query param - limit
  if (query.limit) {
    if (!parseInt(query.limit, 10)) {
      throw new ValidationError(
        "Validation failed: Query - limit should be an integer",
      );
    }
    formattedQuery.limit = parseInt(query.limit, 10);
  }
  // Process the query param - includeTasks
  return formattedQuery;
};

module.exports = {
  validateQueryParams,
};
