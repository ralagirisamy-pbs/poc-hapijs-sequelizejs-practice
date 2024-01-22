const { SORT_ORDER_LIST } = require("../../lib/constants");
const { employeeAssociationQuery } = require("../../lib/constants");
const { ValidationError } = require("../../lib/error");

/**
 * Validate query limit or offset
 * @param {object} query The incoming query params from the user.
 * @param {object} formattedQuery Formatted query params
 * @param {string} validateFor query property name - 'limit' or 'offset'
 */
const validateLimitOffset = (query, formattedQuery, validateFor) => {
  if (query[validateFor]) {
    if (Number.isNaN(parseInt(query[validateFor], 10))) {
      throw new ValidationError(
        `Validation failed: Query - ${validateFor} should be an integer`,
      );
    }
    formattedQuery[validateFor] = parseInt(query[validateFor], 10);
  } else {
    formattedQuery[validateFor] = validateFor === "limit" ? 10 : 0;
  }
};

/**
 * Validate the query params and return the formatted one.
 * @param {object} query The incoming query params from the user.
 * @return {object} Formatted query params.
 */
const validateQueryParams = (query) => {
  const formattedQuery = {};
  // If includeTasks query present, irrespective of the value, send the associated task data.
  if (typeof query.includeTasks === "string") {
    Object.assign(formattedQuery, employeeAssociationQuery);
  }
  if (!formattedQuery.order) formattedQuery.order = [];
  // Process the query param - orderBy
  if (query.orderBy) {
    const orderBy = query.orderBy.toLowerCase();
    if (!SORT_ORDER_LIST[orderBy]) {
      throw new ValidationError(
        "Validation failed: Query - orderBy should be either 'newestFirst' or 'oldestFirst'",
      );
    }
    // Append or add sorting order configuration
    formattedQuery.order = [...formattedQuery.order, SORT_ORDER_LIST[orderBy]];
  } else {
    // Add default sorting method - DESC
    formattedQuery.order = [
      ...formattedQuery.order,
      SORT_ORDER_LIST.newestfirst,
    ];
  }
  // Process the query param - limit
  validateLimitOffset(query, formattedQuery, "limit");
  // Process the query param - offset
  validateLimitOffset(query, formattedQuery, "offset");
  return formattedQuery;
};

module.exports = {
  validateQueryParams,
};
