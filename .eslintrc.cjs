/** @type {import("path")} */
const path = require("node:path");

/** @type {import("typescript")} */
const ts = require("typescript");

const srcDependencies = {
	devDependencies: false,
	optionalDependencies: false,
	peerDependencies: false,
};

const devDependencies = {
	devDependencies: true,
	optionalDependencies: false,
	peerDependencies: false,
};

const testFileSuffixes = ["test", "spec", "mock"];

/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
	root: true,
	reportUnusedDisableDirectives: true,
	env: { es2022: true, node: true, browser: false },
	parser: "@typescript-eslint/parser",
	parserOptions: { project: "./tsconfig.node.json" },
	settings: {
		"import/parsers": { "@typescript-eslint/parser": [".ts", ".tsx"] },
		"import/resolver": {
			"eslint-import-resolver-typescript": { project: "./tsconfig.node.json" },
		},
	},
	plugins: ["filenames", "deprecation"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/strict-type-checked",
		"plugin:@typescript-eslint/stylistic-type-checked",
		"plugin:import/recommended",
		"plugin:import/typescript",
		"plugin:prettier/recommended",
	],
	rules: {
		"camelcase": "off",
		"curly": ["warn", "multi-line", "consistent"],
		"no-console": "off",
		"no-restricted-syntax": [
			"warn",
			{ selector: "TSEnumDeclaration", message: "Avoid using enums" },
		],
		"no-unreachable": "error",
		"@typescript-eslint/consistent-type-definitions": ["warn", "type"],
		"@typescript-eslint/consistent-type-imports": [
			"error",
			{ disallowTypeAnnotations: false },
		],
		"@typescript-eslint/member-ordering": ["warn"],
		"no-shadow": "off",
		"@typescript-eslint/no-shadow": [
			"error",
			{
				ignoreTypeValueShadow: false,
				ignoreFunctionTypeParameterNameValueShadow: true,
			},
		],
		"no-throw-literal": "off",
		"@typescript-eslint/no-throw-literal": "error",
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": [
			"error",
			{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
		],
		"filenames/match-regex": ["error", "^[a-z0-9-.]+$", true],
		"filenames/match-exported": ["error", "kebab"],
		"import/no-cycle": "error",
		"import/no-self-import": "error",
		"import/no-unused-modules": "error",
		"import/no-useless-path-segments": "error",
		"import/no-extraneous-dependencies": ["error", devDependencies],
		"import/order": importOrderConfig("tsconfig.node.json"),
		"deprecation/deprecation": "warn",
		"prettier/prettier": "warn",
	},
	overrides: [
		{
			files: ["*.c[jt]s?(x)"],
			parserOptions: { sourceType: "script" },
			rules: { "@typescript-eslint/no-var-requires": "off" },
		},
		{
			files: ["*.?(c)js?(x)"],
			extends: ["plugin:@typescript-eslint/disable-type-checked"],
			rules: {
				"deprecation/deprecation": "off",
			},
		},
		{
			files: ["./*"],
			rules: {
				"filenames/match-exported": "off",
			},
		},
		{
			files: ["src-isolation/**/*", "src/**/*"],
			env: { node: false, browser: true },
			parserOptions: { project: "./tsconfig.web.json" },
			settings: {
				"import/parsers": { "@typescript-eslint/parser": [".ts", ".tsx"] },
				"import/resolver": {
					"eslint-import-resolver-typescript": {
						project: "./tsconfig.web.json",
					},
				},
			},
		},
		{
			files: ["src/**/*"],
			settings: { tailwindcss: { callees: ["twMerge", "twJoin"] } },
			extends: ["plugin:tailwindcss/recommended", "plugin:solid/typescript"],
			rules: {
				"no-console": "error",
				"import/no-extraneous-dependencies": ["error", srcDependencies],
				"import/order": importOrderConfig("tsconfig.web.json"),
			},
		},
		{
			files: testFilePatterns(),
			env: { node: true },
			extends: ["plugin:vitest/all"],
			rules: {
				"no-console": "off",
				"import/no-extraneous-dependencies": ["error", devDependencies],
				"filenames/match-exported": [
					"error",
					"kebab",
					`\\.(${testFileSuffixes.join("|")})$`,
				],
				"vitest/no-hooks": "off",
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
		{
			files: testFilePatterns({ root: "./src", extensions: "[jt]sx" }),
			extends: ["plugin:testing-library/dom", "plugin:jest-dom/recommended"],
		},
	],
};

function testFilePatterns({ root = "", extensions = "*" } = {}) {
	return [
		`*.{${testFileSuffixes.join(",")}}`,
		"__{test,tests,mocks,fixtures}__/**/*",
		"__{test,mock,fixture}-*__/**/*",
	].map((pattern) => path.join(root, `**/${pattern}.${extensions}`));
}

/**
 * @typedef {import("eslint").Linter.RuleLevel} RuleLevel
 * @param {string} tsconfigName
 * @param {(config: Record<string, unknown>) => Record<string, unknown>} customizer
 *
 * @returns {[RuleLevel, Record<string, unknown>]}
 **/
function importOrderConfig(tsconfigName, customizer = (config) => config) {
	const tsconfigFile = ts.findConfigFile(
		__dirname,
		ts.sys.fileExists,
		tsconfigName,
	);

	const config = tsconfigFile
		? ts.readConfigFile(tsconfigFile, ts.sys.readFile)
		: undefined;

	const aliases = Object.keys(config?.config?.compilerOptions?.paths ?? {});

	return [
		"warn",
		customizer({
			"alphabetize": { order: "asc" },
			"groups": [
				"builtin",
				"external",
				"internal",
				["parent", "sibling", "index"],
				"type",
			],
			"pathGroups": aliases.map((pattern) => ({ pattern, group: "internal" })),
			"pathGroupsExcludedImportTypes": ["type"],
			"newlines-between": "always",
		}),
	];
}