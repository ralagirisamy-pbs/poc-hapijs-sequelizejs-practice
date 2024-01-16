const Lab = require("@hapi/lab");
const Code = require("@hapi/code");
const { startServer } = require("../src/index");
const { expect } = Code;
const { describe, it, before, after } = (exports.lab = Lab.script());
const InputData = require("./mock/input.json");
const OutputData = require("./mock/output.json");
const { getEmployeesValid } = require("./utils/get-employee");
const { getTasksValid } = require("./utils/get-tasks");

describe("Task module (create & get all task)", () => {
	let server, employeeId;
	before(async () => {
		server = await startServer();
		const employees = await getEmployeesValid(server);
		employeeId = employees?.data?.find(
			(record) => record.name === InputData.postTaskValid.name
		)?.id;
	});
	// POST method
	it("POST Task - Without credentials", async () => {
		const options = {
			method: "POST",
			url: "/task",
			headers: {},
			payload: InputData.postTaskValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.noAuthToken);
	});
	it("POST Task - Invalid credentials", async () => {
		const options = {
			method: "POST",
			url: "/task",
			headers: { Authorization: InputData.authToken.invalid },
			payload: InputData.postTaskValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.invalidAuthToken);
	});
	it("POST Task - Valid credentials", async () => {
		const options = {
			method: "POST",
			url: "/task",
			headers: { Authorization: InputData.authToken.valid },
			payload: Object.assign(InputData.postTaskValid, { assigned_employee_id: employeeId })
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(201);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.createTaskSuccess);
	});
	it("POST Task - Missing mandatory fields", async () => {
		const options = {
			method: "POST",
			url: "/task",
			headers: { Authorization: InputData.authToken.valid },
			payload: InputData.postTaskMissingMandatoryFields
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.createTaskMissingFields);
	});
	it("POST Task - Unsupported fields", async () => {
		const options = {
			method: "POST",
			url: "/task",
			headers: { Authorization: InputData.authToken.valid },
			payload: InputData.postTaskUnsupportedFields
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.unsupportedFieldsInTask);
	});
	it("POST Task - Unsupported Priority value", async () => {
		const options = {
			method: "POST",
			url: "/task",
			headers: { Authorization: InputData.authToken.valid },
			payload: InputData.postTaskInvalidPriority
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.invalidPriorityInTask);
	});
	it("POST Task - Adding unavailable employee", async () => {
		const options = {
			method: "POST",
			url: "/task",
			headers: { Authorization: InputData.authToken.valid },
			payload: InputData.postTaskInvalidEmployeeId
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.invalidEmployeeIdInTask);
	});
	// GET /tasks method
	it("GET Tasks - Without credentials", async () => {
		const options = {
			method: "GET",
			url: "/tasks",
			headers: {}
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.noAuthToken);
	});
	it("GET Tasks - Invalid credentials", async () => {
		const options = {
			method: "GET",
			url: "/tasks",
			headers: { Authorization: InputData.authToken.invalid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.invalidAuthToken);
	});
	it("GET Tasks - Valid credentials", async () => {
		const payload = await getTasksValid(server);
		expect(payload?.statusCode).to.be.number().equal(200);
		expect(payload?.data).to.be.array();
	});
	after(() => {
		server?.stop();
	});
});

describe("Task module (update, delete & get by ID)", () => {
	let server, employeeId, taskId;
	before(async () => {
		server = await startServer();
		const employees = await getEmployeesValid(server);
		const tasks = await getTasksValid(server);
		employeeId = employees?.data?.find(
			(record) => record.name === InputData.postTaskValid.name
		)?.id;
		taskId = tasks?.data?.find(
			(record) => record.name === InputData.postTaskValid.name
		)?.id;
	});
	// PUT method
	it("PUT Task - Without credentials", async () => {
		const options = {
			method: "PUT",
			url: `/task/${taskId}`,
			headers: {},
			payload: InputData.putTaskValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.noAuthToken);
	});
	it("PUT Task - Invalid credentials", async () => {
		const options = {
			method: "PUT",
			url: `/task/${taskId}`,
			headers: { Authorization: InputData.authToken.invalid },
			payload: InputData.putTaskValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.invalidAuthToken);
	});
	it("PUT Task - Valid credentials", async () => {
		const options = {
			method: "PUT",
			url: `/task/${taskId}`,
			headers: { Authorization: InputData.authToken.valid },
			payload: Object.assign(InputData.putTaskValid, { assigned_employee_id: employeeId })
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(201);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.updateTaskSuccess);
	});
	it("PUT Task - Unsupported fields", async () => {
		const options = {
			method: "PUT",
			url: `/task/${taskId}`,
			headers: { Authorization: InputData.authToken.valid },
			payload: InputData.putTaskUnsupportedFields
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.unsupportedFieldsInTask);
	});
	it("PUT Task - Unsupported Priority value", async () => {
		const options = {
			method: "PUT",
			url: `/task/${taskId}`,
			headers: { Authorization: InputData.authToken.valid },
			payload: InputData.putTaskInvalidPriority
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.invalidPriorityInTask);
	});
	it("PUT Task - Adding unavailable employee", async () => {
		const options = {
			method: "PUT",
			url: `/task/${taskId}`,
			headers: { Authorization: InputData.authToken.valid },
			payload: InputData.putTaskInvalidEmployeeId
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.invalidEmployeeIdInTask);
	});
	it("PUT Task - Invalid id", async () => {
		const options = {
			method: "PUT",
			url: `/task/${InputData.invalidId}`,
			headers: { Authorization: InputData.authToken.valid },
			payload: InputData.putTaskValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.invalidTask);
	});
	it("PUT Task - Non existent task", async () => {
		const options = {
			method: "PUT",
			url: `/task/${InputData.nonexistentId}`,
			headers: { Authorization: InputData.authToken.valid },
			payload: InputData.putTaskValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(404);
		expect(payload?.error).to.be.string().equal(OutputData.name.NotFound);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.taskNotFound);
	});
	// GET /task/{id} method
	it("GET Task - Without credentials", async () => {
		const options = {
			method: "GET",
			url: `/task/${taskId}`,
			headers: {}
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.noAuthToken);
	});
	it("GET Task - Invalid credentials", async () => {
		const options = {
			method: "GET",
			url: `/task/${taskId}`,
			headers: { Authorization: InputData.authToken.invalid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.invalidAuthToken);
	});
	it("GET Task - Valid credentials", async () => {
		const options = {
			method: "GET",
			url: `/task/${taskId}`,
			headers: { Authorization: InputData.authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(200);
		expect(payload?.data).to.be.object();
	});
	it("GET Task - Invalid task id", async () => {
		const options = {
			method: "GET",
			url: `/task/${InputData.invalidId}`,
			headers: { Authorization: InputData.authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message).to.be.string().equal(OutputData.message.invalidTask);
	});
	it("GET Task - Non existent task", async () => {
		const options = {
			method: "GET",
			url: `/task/${InputData.nonexistentId}`,
			headers: { Authorization: InputData.authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(404);
		expect(payload?.error).to.be.string().equal(OutputData.name.NotFound);
		expect(payload?.message).to.be.string().equal(OutputData.message.taskNotFound);
	});
	// DELETE /task/{id} method
	it("DELETE Task - Without credentials", async () => {
		const options = {
			method: "DELETE",
			url: `/task/${taskId}`,
			headers: {}
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.noAuthToken);
	});
	it("DELETE Task - Invalid credentials", async () => {
		const options = {
			method: "DELETE",
			url: `/task/${taskId}`,
			headers: { Authorization: InputData.authToken.invalid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.invalidAuthToken);
	});
	it("DELETE Task - Invalid task id", async () => {
		const options = {
			method: "DELETE",
			url: `/task/${InputData.invalidId}`,
			headers: { Authorization: InputData.authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message).to.be.string().equal(OutputData.message.invalidTask);
	});
	it("DELETE Task - Non existent task", async () => {
		const options = {
			method: "DELETE",
			url: `/task/${InputData.nonexistentId}`,
			headers: { Authorization: InputData.authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(404);
		expect(payload?.error).to.be.string().equal(OutputData.name.NotFound);
		expect(payload?.message).to.be.string().equal(OutputData.message.taskNotFound);
	});
	it("DELETE Task - Valid credentials", async () => {
		const options = {
			method: "DELETE",
			url: `/task/${taskId}`,
			headers: { Authorization: InputData.authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(200);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.deleteTaskSuccess);
	});
	after(() => {
		server?.stop();
	});
});
