import path from "path"
import { Configuration } from "webpack"

import {
	BASE_SRC_PATH,
	BASE_BUILD_PATH,
	createTSLoaderRule,
} from "../base"

const ROOT_PATH =
	path.join(BASE_SRC_PATH, "player", "service-worker")

const SRC_PATH =
	path.join(ROOT_PATH, "src")

const SRC_ENTRY_PATH =
	path.join(SRC_PATH, "index.ts")

const TSCONFIG_PATH =
	path.join(ROOT_PATH, "tsconfig.json")

const BUILD_PATH =
	path.join(BASE_BUILD_PATH, "player", "public")

const configuration: Configuration = {
	devtool: false,
	stats: "errors-only",
	entry: SRC_ENTRY_PATH,
	mode: process.env.NODE_ENV,
	output: {
		path: BUILD_PATH,
		filename: "service-worker.js",
	},
	watchOptions: {
		ignored: "/node_modules/",
	},
	experiments: {
		topLevelAwait: true,
	},
	resolve: {
		symlinks: false,
		fullySpecified: false,
		extensions: [".js", ".ts"],
	},
	module: {
		rules: [
			{
				test: /\.m?js/,
				resolve: {
					fullySpecified: false,
				},
			},
			createTSLoaderRule(TSCONFIG_PATH),
		],
	},
}

export default configuration