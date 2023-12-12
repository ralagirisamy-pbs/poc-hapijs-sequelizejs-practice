const hapi = require("@hapi/hapi")
const qs = require("qs")

// constants
const DEFAULT_PORT = 3000
const DEFAULT_HOST = "localhost"

;(async function () {
	const server = hapi.server({
		port: process.env.PORT || DEFAULT_PORT,
		host: process.env.HOST || DEFAULT_HOST,
		query: {
			parser: (query) => qs.parse(query)
		}
	})
	await server.start()
	console.info(`Server started on ${JSON.stringify(server.info.uri)}`)
	// console.info(`${JSON.stringify(server.version)}`)
})()
