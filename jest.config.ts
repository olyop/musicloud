import { Config } from "@jest/types"

const config: Config.InitialOptions = {
	verbose: false,
	roots: ["<rootDir>/src"],
	transform: { "^.+\\.tsx?$": "ts-jest" },
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
}

export default config