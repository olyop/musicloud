import path from "path"
import { Configuration } from "webpack"
import ESLintPlugin from "eslint-webpack-plugin"

import {
	IS_DEV,
	BASE_ROOT_PATH,
	BASE_BUILD_PATH,
	createTSLoaderOptions,
} from "../../webpack.config"

const ROOT_PATH =
	path.join(BASE_ROOT_PATH, "player", "service-worker")

const SRC_PATH =
	path.join(ROOT_PATH, "src")

const SRC_ENTRY_PATH =
	path.join(SRC_PATH, "index.ts")

const ROOT_TSCONFIG_PATH =
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
	resolve: {
		symlinks: false,
		extensions: [".js", ".ts"],
	},
	module: {
		rules: [{
			test: /\.ts$/,
			exclude: /node_modules/,
			use: [{
				loader: "ts-loader",
				options: createTSLoaderOptions({
					configFile: ROOT_TSCONFIG_PATH,
				}),
			}],
		}],
	},
	plugins: IS_DEV ? [
		new ESLintPlugin({
			extensions: ["ts"],
		}),
	] : undefined,
}

export default configuration