const fs = require("fs/promises");
const path = require("path");
const Boom = require("@hapi/boom");

const employeesFilePath = path.join(__dirname, "../_data/employees.json");

/**
 * Read the json file and return the content.
 * @return {Array} JSON Array of employees.
 */
const getEmployeesData = async () => {
	try {
		const data = await fs.readFile(employeesFilePath, "utf-8");
		return JSON.parse(data);
	} catch (error) {
		return [];
	}
};

/**
 * Write the data into the json file.
 * @param {Object} data JSON content to be written to the file.
 */
const updateEmployeesData = async (data) => {
    try {
        await fs.writeFile(employeesFilePath, JSON.stringify(data, null, 2), {
			encoding: "utf-8"
		});
    } catch (error) {
        console.error(`Couldn't write to file ${employeesFilePath}. Error: `, error.message);
        throw Boom.internal("Couldn't persist data. Try again later")
    }
};

module.exports = {
    getEmployeesData,
    updateEmployeesData
}