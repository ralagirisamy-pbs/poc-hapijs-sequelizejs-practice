const formatOutput = (data) => data?.get({ plain: true });

const createEmployee = (payload, EmployeeModel) =>
  EmployeeModel.create(payload).then(formatOutput);

const getEmployeeById = (id, EmployeeModel) => {
  const query = {
    where: {
      id,
    },
  };
  return EmployeeModel.findOne(query).then(formatOutput);
};

const getEmployees = (EmployeeModel) =>
  EmployeeModel.findAll().then((queryResponse) =>
    queryResponse.map(formatOutput),
  );

const updateEmployee = (id, payload, EmployeeModel) => {
  const query = {
    where: {
      id,
    },
    returning: true,
  };
  return EmployeeModel.update(payload, query);
};

const deleteEmployee = (id, EmployeeModel) => {
  const query = {
    where: {
      id,
    },
  };
  return EmployeeModel.destroy(query);
};

module.exports = {
  createEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
  deleteEmployee,
};
