const Lab = require("@hapi/lab");
const Code = require("@hapi/code");
const { startServer } = require("../src/index");
const { expect } = Code;
const { describe, it, before, after } = (exports.lab = Lab.script());
const EmployeeMockData = require("./mock/employee.mock.json");

describe("Employee module", () => {
	let server;
	const authToken = {
		valid:
			"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJzY29wZSI6ImFsbCIsImlhdCI6MTcwMzA1Mjc0MX0.yO2US9pLRDl53d2yulCfyUFM4-TTIBfVXeh1sEXn0lM",
		invalid: "Bearer some-invalid-token"
	};
	before(async () => {
		server = await startServer();
		console.log(server)
	});
	// POST method
	it("POST Employee - Without credentials", async () => {
		const options = {
			method: "POST",
			url: "/employee",
			headers: {},
			payload: EmployeeMockData.postEmployeeValid
		};
        const response = await server.inject(options);
        const payload = JSON.parse(response.payload || {});
		expect(payload?.statusCode).to.be.equal(401);
		expect(payload?.error).to.be.equal("Unauthorized");
		expect(payload?.message).to.be.equal("Authentication failed: No Authorization header");
		// console.log(JSON.stringify(res, null, 4));
	});
	it("POST Employee - Invalid credentials", async () => {});
	it("POST Employee - Valid credentials", async () => {});
	it("POST Employee - Missing mandatory fields", async () => {});
	it("POST Employee - Unsupported fields", async () => {});
	// PUT method
	it("PUT Employee - Without credentials", async () => {});
	it("PUT Employee - Invalid credentials", async () => {});
	it("PUT Employee - Valid credentials", async () => {});
	it("PUT Employee - Unsupported fields", async () => {});
	// GET /employee/{id} method
	it("GET Employee - Without credentials", async () => {});
	it("GET Employee - Invalid credentials", async () => {});
	it("GET Employee - Valid credentials", async () => {});
	it("GET Employee - Invalid employee id", async () => {});
	// GET /employees method
	it("GET Employee - Without credentials", async () => {});
	it("GET Employee - Invalid credentials", async () => {});
	it("GET Employee - Valid credentials", async () => {});
	// DELETE /employee/{id} method
	it("DELETE Employee - Without credentials", async () => {});
	it("DELETE Employee - Invalid credentials", async () => {});
	it("DELETE Employee - Valid credentials", async () => {});
	it("DELETE Employee - Invalid employee id", async () => {});
	//Unsupported route
	it("GET Random route - Unsupported route", async () => {});
	after(() => {
		server.stop();
	});
});
