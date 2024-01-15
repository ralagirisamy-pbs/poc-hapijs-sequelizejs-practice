// constants: Uses this if env value is unavailable.
exports.DEFAULT_PORT = 3000;
exports.DEFAULT_HOST = "localhost";

// List of all fields in Employee entity
exports.EMPLOYEE_FIELDS = ["name", "position", "team", "experience"];

// List of all fields in Task entity
exports.TASK_FIELDS = [
  "title",
  "description",
  "priority",
  "labels",
  "assigned_employee_id",
];
exports.MANDATORY_TASK_FIELDS = ["title"];

exports.PRIORITY_ENUM = ["Low", "Medium", "High"];

exports.employeeAssociationQuery = {
  order: [["tasks", "id", "ASC"]],
  include: [
    {
      association: "tasks",
      attributes: {
        exclude: ["assigned_employee_id"],
      },
    },
  ],
};
// HTTP Response statuses
exports.HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
