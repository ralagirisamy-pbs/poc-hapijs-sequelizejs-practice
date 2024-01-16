// constants: Uses this if env value is unavailable.
const DEFAULT_PORT = 3000;
const DEFAULT_HOST = "localhost";

// List of all fields in Employee entity
const EMPLOYEE_FIELDS = ["name", "position", "team", "experience"];

// List of all fields in Task entity
const TASK_FIELDS = [
  "title",
  "description",
  "priority",
  "labels",
  "assigned_employee_id",
];
const MANDATORY_TASK_FIELDS = ["title"];

const PRIORITY_ENUM = ["Low", "Medium", "High"];

const employeeAssociationQuery = {
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
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const SORT_ORDER_LIST = {
  newestfirst: ["id", "DESC"],
  oldestfirst: ["id", "ASC"],
};

module.exports = {
  DEFAULT_PORT,
  DEFAULT_HOST,
  EMPLOYEE_FIELDS,
  TASK_FIELDS,
  MANDATORY_TASK_FIELDS,
  PRIORITY_ENUM,
  employeeAssociationQuery,
  HTTP_STATUS,
  SORT_ORDER_LIST,
};
