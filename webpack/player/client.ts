import path from "node:path"
import { merge } from "webpack-merge"
import { Configuration } from "webpack"
import HTMLWebpackPlugin from "html-webpack-plugin"
import { TITLE } from "@oly_op/musicloud-common/build/metadata"

import baseConfiguration, {
	BASE_SRC_PATH,
	BASE_BUILD_PATH,
	createTSLoaderRule,
	createDevServerProxy,
	createHTMLPluginOptions,
} from "../base"

const ROOT_PATH =
	path.join(BASE_SRC_PATH, "player", "client")

const SRC_PATH =
	path.join(ROOT_PATH, "src")

const SRC_ENTRY_PATH =
	path.join(SRC_PATH, "index.tsx")

const SRC_INDEX_PATH =
	path.join(SRC_PATH, "index.html")

const ROOT_TSCONFIG_PATH =
	path.join(ROOT_PATH, "tsconfig.json")

const BUILD_PATH =
	path.join(BASE_BUILD_PATH, "player", "public")

const configuration: Configuration = {
	entry: SRC_ENTRY_PATH,
	output: {
		path: BUILD_PATH,
	},
	devServer: {
		port: parseInt(process.env.PLAYER_CLIENT_PORT),
		proxy: [
			createDevServerProxy(process.env.PLAYER_SERVER_PORT, [
				"/graphql",
				"/ping.txt",
				"/service-worker.js",
				"/manifest.webmanifest",
			]),
			{
				timeout: 120000,
				logLevel: "silent",
				context: "/logo/**",
				secure: process.env.USE_HTTPS ? false : undefined,
				target: `${process.env.USE_HTTPS ? "https" : "http"}://${process.env.HOST}:${process.env.PLAYER_SERVER_PORT}`,
			},
		],
	},
	module: {
		rules: [
			createTSLoaderRule({
				configFile: ROOT_TSCONFIG_PATH,
			}),
			{
				test: /\.gql$/,
				exclude: /node_modules/,
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
}

export default merge(baseConfiguration, configuration)