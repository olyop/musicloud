import path from "node:path";

import { TITLE } from "@oly_op/musicloud-common/build/metadata";
import HTMLWebpackPlugin from "html-webpack-plugin";
import { Configuration } from "webpack";
import { merge } from "webpack-merge";

import baseConfiguration, {
	BASE_BUILD_PATH,
	BASE_SRC_PATH,
	createDevelopmentServerProxy,
	createHTMLPluginOptions,
	createTSLoaderRule,
} from "../base";

const ROOT_PATH = path.join(BASE_SRC_PATH, "player", "client");
const SRC_PATH = path.join(ROOT_PATH, "src");
const SRC_ENTRY_PATH = path.join(SRC_PATH, "index.tsx");
const SRC_INDEX_PATH = path.join(SRC_PATH, "index.html");
const TSCONFIG_PATH = path.join(ROOT_PATH, "tsconfig.json");
const BUILD_PATH = path.join(BASE_BUILD_PATH, "player", "public");

const configuration: Configuration = {
	entry: SRC_ENTRY_PATH,
	output: {
		path: BUILD_PATH,
	},
	devServer: {
		port: Number.parseInt(process.env.PLAYER_CLIENT_PORT),
		proxy: [
			createDevelopmentServerProxy(process.env.PLAYER_SERVER_PORT, [
				"/graphql",
				"/ping.txt",
				"/service-worker.js",
				"/manifest.webmanifest",
			]),
			{
				timeout: 120_000,
				logLevel: "silent",
				context: "/logo/**",
				secure: process.env.HTTPS ? false : undefined,
				headers: {
					"Content-Type": "image/png",
				},
				target: `${process.env.HTTPS ? "https" : "http"}://${process.env.HOST}:${
					process.env.PLAYER_SERVER_PORT
				}`,
			},
		],
	},
	module: {
		rules: [
			createTSLoaderRule(TSCONFIG_PATH),
			{
				test: /\.gql$/,
				loader: "graphql-mini-transforms/webpack-loader",
			},
		],
	},
	plugins: [
		new HTMLWebpackPlugin(
			createHTMLPluginOptions({
				title: `${TITLE} Player`,
				template: SRC_INDEX_PATH,
			}),
		),
	],
};

export default merge(baseConfiguration, configuration);
