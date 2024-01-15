const Lab = require("@hapi/lab");
const Code = require("@hapi/code");
const { startServer } = require("../src/index");
const { expect } = Code;
const { describe, it, before, after } = (exports.lab = Lab.script());
const InputData = require("./mock/input.json");
const OutputData = require("./mock/output.json");

describe("Wildcard route handler", () => {
	let server;
	before(async () => {
		server = await startServer();
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
