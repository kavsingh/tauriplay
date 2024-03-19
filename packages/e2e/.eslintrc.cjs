/** @type {import("path")} */
const path = require("node:path");

/** @type {any} */
const { importOrderConfig } = require("../../.eslint.helpers.cjs");

const testFileSuffixes = ["spec", "mock"];

/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
	root: true,
	parserOptions: { project: path.resolve(__dirname, "./tsconfig.json") },
	settings: {
		"import/resolver": {
			"eslint-import-resolver-typescript": {
				project: path.resolve(__dirname, "./tsconfig.json"),
			},
		},
	},
	extends: [require.resolve("../../.eslintrc.cjs")],
	rules: {
		"import/order": importOrderConfig("tsconfig.json"),
	},
	overrides: [
		{
			files: ["./*"],
			rules: {
				"filenames/match-exported": "off",
			},
		},
		{
			files: testFilePatterns(),
			env: { node: true },
			plugins: ["wdio"],
			extends: ["plugin:wdio/recommended"],
			rules: {
				"no-console": "off",
				"filenames/match-exported": [
					"error",
					"kebab",
					`\\.(${testFileSuffixes.join("|")})$`,
				],
				"@typescript-eslint/no-explicit-any": "off",
				"@typescript-eslint/no-non-null-assertion": "off",
				"@typescript-eslint/no-unsafe-argument": "off",
				"@typescript-eslint/no-unsafe-assignment": "off",
				"@typescript-eslint/no-unsafe-call": "off",
				"@typescript-eslint/no-unsafe-member-access": "off",
				"@typescript-eslint/no-unsafe-return": "off",
				"@typescript-eslint/unbound-method": "off",
			},
		},
	],
};

function testFilePatterns({ root = "", extensions = "*" } = {}) {
	return [
		`*.{${testFileSuffixes.join(",")}}`,
		"__{specs,mocks,fixtures}__/**/*",
		"__{spec,mock,fixture}-*__/**/*",
	].map((pattern) => path.join(root, `**/${pattern}.${extensions}`));
}
