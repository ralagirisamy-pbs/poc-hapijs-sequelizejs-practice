const Lab = require("@hapi/lab");
const Code = require("@hapi/code");
const { startServer } = require("../src/index");
const { expect } = Code;
const { describe, it, before, after } = (exports.lab = Lab.script());
const InputData = require("./mock/input.json");
const OutputData = require("./mock/output.json");
const { getEmployeesValid } = require("./utils/get-employee");

describe("Employee module (create & get all employee)", () => {
	let server;
	before(async () => {
		server = await startServer();
	});
	// POST method
	it("POST Employee - Without credentials", async () => {
		const options = {
			method: "POST",
			url: "/employee",
			headers: {},
			payload: InputData.postEmployeeValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.noAuthToken);
	});
	it("POST Employee - Invalid credentials", async () => {
		const options = {
			method: "POST",
			url: "/employee",
			headers: { Authorization: InputData.authToken.invalid },
			payload: InputData.postEmployeeValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.invalidAuthToken);
	});
	it("POST Employee - Valid credentials", async () => {
		const options = {
			method: "POST",
			url: "/employee",
			headers: { Authorization: InputData.authToken.valid },
			payload: InputData.postEmployeeValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(201);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.createEmployeeSuccess);
	});
	it("POST Employee - Missing mandatory fields", async () => {
		const options = {
			method: "POST",
			url: "/employee",
			headers: { Authorization: InputData.authToken.valid },
			payload: InputData.postEmployeeMissingMandatoryFields
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.createEmployeeMissingFields);
	});
	it("POST Employee - Unsupported fields", async () => {
		const options = {
			method: "POST",
			url: "/employee",
			headers: { Authorization: InputData.authToken.valid },
			payload: InputData.postEmployeeUnsupportedFields
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.createEmployeeUnsupportedFields);
	});
	// GET /employees method
	it("GET Employees - Without credentials", async () => {
		const options = {
			method: "GET",
			url: "/employees",
			headers: {}
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.noAuthToken);
	});
	it("GET Employees - Invalid credentials", async () => {
		const options = {
			method: "GET",
			url: "/employees",
			headers: { Authorization: InputData.authToken.invalid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.invalidAuthToken);
	});
	it("GET Employees - Valid credentials without query params", async () => {
		const payload = await getEmployeesValid(server);
		expect(payload?.statusCode).to.be.number().equal(200);
		expect(payload?.data).to.be.array();
	});
	it("GET Employees - Invalid query - orderBy", async () => {
		const payload = await getEmployeesValid(server, "orderBy=sortbyid");
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message).to.be.string().equal(OutputData.message.invalidQueryOrderByForGet);
	});
	it("GET Employees - Invalid query - limit", async () => {
		const payload = await getEmployeesValid(server, "limit=x");
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message).to.be.string().equal(OutputData.message.invalidQueryLimitForGet);
	});
	it("GET Employees - Valid credentials with query params", async () => {
		const payload = await getEmployeesValid(server, "includeTasks&limit=6&orderBy=newestFirst");
		expect(payload?.statusCode).to.be.number().equal(200);
		expect(payload?.data).to.be.array();
	});
	//Unsupported route
	it("GET Random route - Unsupported route", async () => {
		const options = {
			method: "GET",
			url: "/not-a-path",
			headers: { Authorization: InputData.authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(404);
		expect(payload?.error).to.be.string().equal(OutputData.name.NotFound);
		expect(payload?.message).to.be.string().equal(OutputData.message.notFoundRoute);
	});
	after(() => {
		server?.stop();
	});
});

describe("Employee module (update, delete & get by ID)", () => {
	let server, id;
	before(async () => {
		server = await startServer();
		const payload = await getEmployeesValid(server);
		id = payload?.data?.find(
			(record) => record.name === InputData.postEmployeeValid.name
		)?.id;
	});
	// PUT method
	it("PUT Employee - Without credentials", async () => {
		const options = {
			method: "PUT",
			url: `/employee/${id}`,
			headers: {},
			payload: InputData.putEmployeeValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.noAuthToken);
	});
	it("PUT Employee - Invalid credentials", async () => {
		const options = {
			method: "PUT",
			url: `/employee/${id}`,
			headers: { Authorization: InputData.authToken.invalid },
			payload: InputData.putEmployeeValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.invalidAuthToken);
	});
	it("PUT Employee - Valid credentials", async () => {
		const options = {
			method: "PUT",
			url: `/employee/${id}`,
			headers: { Authorization: InputData.authToken.valid },
			payload: InputData.putEmployeeValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(201);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.updateEmployeeSuccess);
	});
	it("PUT Employee - Unsupported fields", async () => {
		const options = {
			method: "PUT",
			url: `/employee/${id}`,
			headers: { Authorization: InputData.authToken.valid },
			payload: InputData.putEmployeeUnsupportedFields
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.updateEmployeeUnsupportedFields);
	});
	it("PUT Employee - Invalid id", async () => {
		const options = {
			method: "PUT",
			url: `/employee/${InputData.invalidId}`,
			headers: { Authorization: InputData.authToken.valid },
			payload: InputData.putEmployeeValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.invalidEmployee);
	});
	it("PUT Employee - Non existent employee", async () => {
		const options = {
			method: "PUT",
			url: `/employee/${InputData.nonexistentId}`,
			headers: { Authorization: InputData.authToken.valid },
			payload: InputData.putEmployeeValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(404);
		expect(payload?.error).to.be.string().equal(OutputData.name.NotFound);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.employeeNotFound);
	});
	// GET /employee/{id} method
	it("GET Employee - Without credentials", async () => {
		const options = {
			method: "GET",
			url: `/employee/${id}`,
			headers: {}
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.noAuthToken);
	});
	it("GET Employee - Invalid credentials", async () => {
		const options = {
			method: "GET",
			url: `/employee/${id}`,
			headers: { Authorization: InputData.authToken.invalid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.invalidAuthToken);
	});
	it("GET Employee - Valid credentials", async () => {
		const options = {
			method: "GET",
			url: `/employee/${id}`,
			headers: { Authorization: InputData.authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(200);
		expect(payload?.data).to.be.object();
	});
	it("GET Employee - Invalid employee id", async () => {
		const options = {
			method: "GET",
			url: `/employee/${InputData.invalidId}`,
			headers: { Authorization: InputData.authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message).to.be.string().equal(OutputData.message.invalidEmployee);
	});
	it("GET Employee - Non existent employee", async () => {
		const options = {
			method: "GET",
			url: `/employee/${InputData.nonexistentId}`,
			headers: { Authorization: InputData.authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(404);
		expect(payload?.error).to.be.string().equal(OutputData.name.NotFound);
		expect(payload?.message).to.be.string().equal(OutputData.message.employeeNotFound);
	});
	// DELETE /employee/{id} method
	it("DELETE Employee - Without credentials", async () => {
		const options = {
			method: "DELETE",
			url: `/employee/${id}`,
			headers: {}
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.noAuthToken);
	});
	it("DELETE Employee - Invalid credentials", async () => {
		const options = {
			method: "DELETE",
			url: `/employee/${id}`,
			headers: { Authorization: InputData.authToken.invalid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal(OutputData.name.Unauthorized);
		expect(payload?.message).to.be.string().equal(OutputData.message.invalidAuthToken);
	});
	it("DELETE Employee - Invalid employee id", async () => {
		const options = {
			method: "DELETE",
			url: `/employee/${InputData.invalidId}`,
			headers: { Authorization: InputData.authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal(OutputData.name.BadRequest);
		expect(payload?.message).to.be.string().equal(OutputData.message.invalidEmployee);
	});
	it("DELETE Employee - Non existent employee", async () => {
		const options = {
			method: "DELETE",
			url: `/employee/${InputData.nonexistentId}`,
			headers: { Authorization: InputData.authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(404);
		expect(payload?.error).to.be.string().equal(OutputData.name.NotFound);
		expect(payload?.message).to.be.string().equal(OutputData.message.employeeNotFound);
	});
	it("DELETE Employee - Valid credentials", async () => {
		const options = {
			method: "DELETE",
			url: `/employee/${id}`,
			headers: { Authorization: InputData.authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(200);
		expect(payload?.message)
			.to.be.string()
			.equal(OutputData.message.deleteEmployeeSuccess);
	});
	after(() => {
		server?.stop();
	});
});
