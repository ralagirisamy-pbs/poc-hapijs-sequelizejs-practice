const EmployeesController = require("../controllers/employees");

exports.plugin = {
	name: "employeeRouter",
	/**
	 * A handler to bind routes to the server.
	 * @param {*} server A Hapi server instance
	 */
	register: async (server) => {
		server.route([
			{ method: "GET", path: "/employees", handler: EmployeesController.getAllEmployees },
			{ method: "GET", path: "/employee/{id}", handler: EmployeesController.getEmployeeById },
			{ method: "POST", path: "/employee", handler: EmployeesController.createEmployee },
			{ method: "PUT", path: "/employee/{id}", handler: EmployeesController.updateEmployee },
			{
				method: "DELETE",
				path: "/employee/{id}",
				handler: EmployeesController.deleteEmployee
			},
			{ method: "*", path: "/*", handler: EmployeesController.sendNotFoundResponse }
		]);
	}
};
