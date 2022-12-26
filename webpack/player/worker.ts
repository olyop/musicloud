import path from "node:path";

import { IS_DEVELOPMENT } from "@oly_op/musicloud-common/build/globals";
import { Configuration } from "webpack";

import { BASE_BUILD_PATH, BASE_SRC_PATH, createTSLoaderRule } from "../base.js";

const ROOT_PATH = path.join(BASE_SRC_PATH, "player", "service-worker");
const SRC_PATH = path.join(ROOT_PATH, "src");
const SRC_ENTRY_PATH = path.join(SRC_PATH, "index.ts");
const TSCONFIG_PATH = path.join(ROOT_PATH, "tsconfig.json");
const BUILD_PATH = path.join(BASE_BUILD_PATH, "player", "public");
const SRC_PLAYER_SERVER_PUBLIC_PATH = path.join(BASE_SRC_PATH, "player", "server", "src", "public");

const configuration: Configuration = {
	devtool: false,
	stats: "errors-only",
	mode: process.env.NODE_ENV,
	entry: SRC_ENTRY_PATH,
	output: {
		filename: "service-worker.js",
		path: IS_DEVELOPMENT ? SRC_PLAYER_SERVER_PUBLIC_PATH : BUILD_PATH,
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
};

export default configuration;
