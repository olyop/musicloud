import path from "path"
import { merge } from "webpack-merge"
import { Configuration } from "webpack"
import { TITLE } from "@oly_op/musicloud-common"
import HTMLWebpackPlugin from "html-webpack-plugin"
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"

import baseConfiguration, {
	BASE_ROOT_PATH,
	BASE_BUILD_PATH,
	createDevServerProxy,
	createTSLoaderOptions,
	createHTMLPluginOptions,
} from "../base"

const ROOT_PATH =
	path.join(BASE_ROOT_PATH, "player", "client")

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

const playerConfiguration: Configuration = {
	entry: SRC_ENTRY_PATH,
	output: {
		path: BUILD_PATH,
	},
	devServer: {
		port: parseInt(process.env.PLAYER_CLIENT_PORT),
		proxy: createDevServerProxy(process.env.PLAYER_SERVER_PORT, [
			"/graphql",
			"/ping.txt",
			"/service-worker.js",
			"/manifest.webmanifest",
		]),
	},
	module: {
		rules: [{
			test: /\.gql$/,
			loader: "graphql-tag/loader",
		},{
			test: /\.tsx?$/,
			use: [{
				loader: "ts-loader",
				options: createTSLoaderOptions({
					configFile: ROOT_TSCONFIG_PATH,
				}),
			}],
		}],
	},
	plugins: [
		new HTMLWebpackPlugin(
			createHTMLPluginOptions({
				title: TITLE,
				template: SRC_INDEX_PATH,
			}),
		),
		...(process.env.ANALYZE_BUNDLE === "true" ? [
			new BundleAnalyzerPlugin({
				openAnalyzer: true,
				defaultSizes: "gzip",
				analyzerMode: "static",
			}),
		] : []),
	],
}

const configuration =
	merge(baseConfiguration, playerConfiguration)

export default configuration