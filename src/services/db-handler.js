/**
 * Convert the DB response into plain object
 * @param {Object} data Response object
 */
const formatOutput = (data) => data?.get({ plain: true });

/**
 * Insert a record in the respective table.
 * @param {object} payload Record to be inserted
 * @param {object} Model Postgres table model
 */
const createRecord = (payload, Model) =>
  Model.create(payload).then(formatOutput);

/**
 * Update the record matching the id in the respective table.
 * @param {string} id Record id
 * @param {object} payload Update payload
 * @param {object} Model Postgres table model
 */
const updateRecord = (id, payload, Model) => {
  const query = {
    where: {
      id,
    },
    returning: true,
  };
  return Model.update(payload, query);
};

/**
 * Delete the record matching the id in the respective table.
 * @param {string} id Record id
 * @param {object} payload Update payload
 * @param {object} Model Postgres table model
 */
const deleteRecord = (id, Model) => {
  const query = {
    where: {
      id,
    },
  };
  return Model.destroy(query);
};

/**
 * Get specific record matching the id in the respective table.
 * @param {string} id Record id
 * @param {object} payload Update payload
 * @param {object} Model Postgres table model
 */
const getRecordById = (id, Model, queryParams = {}) => {
  const query = {
    where: {
      id,
    },
    ...queryParams,
  };
  return Model.findOne(query).then(formatOutput);
};

/**
 * Get all the records of the respective table.
 * @param {object} Model Postgres table model
 * @param {object} queryParams Request query paramter
 */
const getRecords = (Model, queryParams = {}) =>
  Model.findAll(queryParams).then((queryResponse) =>
    queryResponse.map(formatOutput),
  );

module.exports = {
  formatOutput,
  createRecord,
  updateRecord,
  deleteRecord,
  getRecordById,
  getRecords,
};
