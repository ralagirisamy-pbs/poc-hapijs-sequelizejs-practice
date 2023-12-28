const Lab = require("@hapi/lab");
const Code = require("@hapi/code");
const { startServer } = require("../src/index");
const { expect } = Code;
const { describe, it, before, after, afterEach } = (exports.lab = Lab.script());
const EmployeeInputData = require("./mock/employee-input.json");
const EmployeeOutputData = require("./mock/employee-output.json");

const authToken = {
	valid: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJzY29wZSI6ImFsbCJ9.yBvyRs6xaw7EhKNSmdorAGrg1PrH0SzMCgKx36hXfNw",
	invalid: "some-invalid-token"
};

/**
 * Invoke GET /employee and return the response payload
 * @param {*} server Hapi.js Server instance.
 * @return {Promise<Object>} Response payload containing employees record. 
 */
const getEmployeesValid = async (server) => {
	const options = {
		method: "GET",
		url: "/employees",
		headers: { Authorization: authToken.valid }
	};
	const response = await server.inject(options);
	return JSON.parse(response.payload || {});
};

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
			payload: EmployeeInputData.postEmployeeValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal("Unauthorized");
		expect(payload?.message).to.be.string().equal(EmployeeOutputData.message.noAuthToken);
	});
	it("POST Employee - Invalid credentials", async () => {
		const options = {
			method: "POST",
			url: "/employee",
			headers: { Authorization: authToken.invalid },
			payload: EmployeeInputData.postEmployeeValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal("Unauthorized");
		expect(payload?.message).to.be.string().equal(EmployeeOutputData.message.invalidAuthToken);
	});
	it("POST Employee - Valid credentials", async () => {
		const options = {
			method: "POST",
			url: "/employee",
			headers: { Authorization: authToken.valid },
			payload: EmployeeInputData.postEmployeeValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(201);
		expect(payload?.message)
			.to.be.string()
			.equal(EmployeeOutputData.message.createEmployeeSuccess);
	});
	it("POST Employee - Missing mandatory fields", async () => {
		const options = {
			method: "POST",
			url: "/employee",
			headers: { Authorization: authToken.valid },
			payload: EmployeeInputData.postEmployeeMissingMandatoryFields
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal("Bad Request");
		expect(payload?.message)
			.to.be.string()
			.equal(EmployeeOutputData.message.createEmployeeMissingFields);
	});
	it("POST Employee - Unsupported fields", async () => {
		const options = {
			method: "POST",
			url: "/employee",
			headers: { Authorization: authToken.valid },
			payload: EmployeeInputData.postEmployeeUnsupportedFields
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal("Bad Request");
		expect(payload?.message)
			.to.be.string()
			.equal(EmployeeOutputData.message.createEmployeeUnsupportedFields);
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
		expect(payload?.error).to.be.string().equal("Unauthorized");
		expect(payload?.message).to.be.string().equal(EmployeeOutputData.message.noAuthToken);
	});
	it("GET Employees - Invalid credentials", async () => {
		const options = {
			method: "GET",
			url: "/employees",
			headers: { Authorization: authToken.invalid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal("Unauthorized");
		expect(payload?.message).to.be.string().equal(EmployeeOutputData.message.invalidAuthToken);
	});
	it("GET Employees - Valid credentials", async () => {
		const payload = await getEmployeesValid(server);
		expect(payload?.statusCode).to.be.number().equal(200);
		expect(payload?.data).to.be.array();
	});
	//Unsupported route
	it("GET Random route - Unsupported route", async () => {
		const options = {
			method: "GET",
			url: "/not-a-path",
			headers: { Authorization: authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(404);
		expect(payload?.error).to.be.string().equal("Not Found");
		expect(payload?.message).to.be.string().equal(EmployeeOutputData.message.notFoundRoute);
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
			(record) => record.name === EmployeeInputData.postEmployeeValid.name
		)?.id;
	});
	// PUT method
	it("PUT Employee - Without credentials", async () => {
		const options = {
			method: "PUT",
			url: `/employee/${id}`,
			headers: {},
			payload: EmployeeInputData.putEmployeeValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal("Unauthorized");
		expect(payload?.message).to.be.string().equal(EmployeeOutputData.message.noAuthToken);
	});
	it("PUT Employee - Invalid credentials", async () => {
		const options = {
			method: "PUT",
			url: `/employee/${id}`,
			headers: { Authorization: authToken.invalid },
			payload: EmployeeInputData.putEmployeeValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal("Unauthorized");
		expect(payload?.message).to.be.string().equal(EmployeeOutputData.message.invalidAuthToken);
	});
	it("PUT Employee - Valid credentials", async () => {
		const options = {
			method: "PUT",
			url: `/employee/${id}`,
			headers: { Authorization: authToken.valid },
			payload: EmployeeInputData.putEmployeeValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(201);
		expect(payload?.message)
			.to.be.string()
			.equal(EmployeeOutputData.message.updateEmployeeSuccess);
	});
	it("PUT Employee - Unsupported fields", async () => {
		const options = {
			method: "PUT",
			url: `/employee/${id}`,
			headers: { Authorization: authToken.valid },
			payload: EmployeeInputData.putEmployeeUnsupportedFields
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(400);
		expect(payload?.error).to.be.string().equal("Bad Request");
		expect(payload?.message)
			.to.be.string()
			.equal(EmployeeOutputData.message.updateEmployeeUnsupportedFields);
	});
	it("PUT Employee - Invalid id", async () => {
		const options = {
			method: "PUT",
			url: `/employee/${EmployeeInputData.invalidId}`,
			headers: { Authorization: authToken.valid },
			payload: EmployeeInputData.putEmployeeValid
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(404);
		expect(payload?.error).to.be.string().equal("Not Found");
		expect(payload?.message)
			.to.be.string()
			.equal(EmployeeOutputData.message.employeeNotFound);
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
		expect(payload?.error).to.be.string().equal("Unauthorized");
		expect(payload?.message).to.be.string().equal(EmployeeOutputData.message.noAuthToken);
	});
	it("GET Employee - Invalid credentials", async () => {
		const options = {
			method: "GET",
			url: `/employee/${id}`,
			headers: { Authorization: authToken.invalid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal("Unauthorized");
		expect(payload?.message).to.be.string().equal(EmployeeOutputData.message.invalidAuthToken);
	});
	it("GET Employee - Valid credentials", async () => {
		const options = {
			method: "GET",
			url: `/employee/${id}`,
			headers: { Authorization: authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(200);
		expect(payload?.data).to.be.object();
	});
	it("GET Employee - Invalid employee id", async () => {
		const options = {
			method: "GET",
			url: `/employee/${EmployeeInputData.invalidId}`,
			headers: { Authorization: authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(404);
		expect(payload?.error).to.be.string().equal("Not Found");
		expect(payload?.message).to.be.string().equal(EmployeeOutputData.message.employeeNotFound);
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
		expect(payload?.error).to.be.string().equal("Unauthorized");
		expect(payload?.message).to.be.string().equal(EmployeeOutputData.message.noAuthToken);
	});
	it("DELETE Employee - Invalid credentials", async () => {
		const options = {
			method: "DELETE",
			url: `/employee/${id}`,
			headers: { Authorization: authToken.invalid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(401);
		expect(payload?.error).to.be.string().equal("Unauthorized");
		expect(payload?.message).to.be.string().equal(EmployeeOutputData.message.invalidAuthToken);
	});
	it("DELETE Employee - Invalid employee id", async () => {
		const options = {
			method: "DELETE",
			url: `/employee/${EmployeeInputData.invalidId}`,
			headers: { Authorization: authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(404);
		expect(payload?.error).to.be.string().equal("Not Found");
		expect(payload?.message).to.be.string().equal(EmployeeOutputData.message.employeeNotFound);
	});
	it("DELETE Employee - Valid credentials", async () => {
		const options = {
			method: "DELETE",
			url: `/employee/${id}`,
			headers: { Authorization: authToken.valid }
		};
		const response = await server.inject(options);
		const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.number().equal(200);
		expect(payload?.message)
			.to.be.string()
			.equal(EmployeeOutputData.message.deleteEmployeeSuccess);
	});
	after(() => {
		server?.stop();
	});
});
