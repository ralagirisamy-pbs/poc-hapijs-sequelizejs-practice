module.exports = {
	extends: ["airbnb-base", "prettier"],
	parser: "@babel/eslint-parser",
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: "module",
		requireConfigFile: false
	},
	env: {
		node: true,
		es2021: true,
		jest: true
	},
	rules: {
		properties: 0,
		"no-underscore-dangle": "off",
		"prefer-destructuring": ["error", { object: true, array: false }],
		"no-param-reassign": "off",
		indent: ["error", 2, { SwitchCase: 1 }],
        "no-console": 0
	}
};
