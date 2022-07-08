import path from "path"
import { merge } from "webpack-merge"
import { Configuration } from "webpack"
import { TITLE } from "@oly_op/musicloud-common"
import HTMLWebpackPlugin from "html-webpack-plugin"

import baseConfiguration, {
	BASE_SRC_PATH,
	BASE_BUILD_PATH,
	createDevServerProxy,
	createTSLoaderOptions,
	createHTMLPluginOptions,
} from "../base"

const ROOT_PATH =
	path.join(BASE_SRC_PATH, "uploader", "client")

const SRC_PATH =
	path.join(ROOT_PATH, "src")

const SRC_ENTRY_PATH =
	path.join(SRC_PATH, "index.tsx")

const SRC_INDEX_PATH =
	path.join(SRC_PATH, "index.html")

const ROOT_TSCONFIG_PATH =
	path.join(ROOT_PATH, "tsconfig.json")

const BUILD_PATH =
	path.join(BASE_BUILD_PATH, "uploader", "public")

const uploadConfiguration: Configuration = {
	entry: SRC_ENTRY_PATH,
	output: {
		path: BUILD_PATH,
	},
	module: {
		rules: [{
			test: /\.tsx?$/,
			exclude: /node_modules/,
			use: [{
				loader: "ts-loader",
				options: createTSLoaderOptions({
					configFile: ROOT_TSCONFIG_PATH,
				}),
			}],
		}],
	},
	devServer: {
		port: parseInt(process.env.UPLOADER_CLIENT_PORT),
		proxy: createDevServerProxy(process.env.UPLOADER_SERVER_PORT, [
			"/api/upload/album",
			"/api/upload/genre",
			"/api/upload/artist",
			"/api/audio-metadata",
		]),
	},
	plugins: [
		new HTMLWebpackPlugin(
			createHTMLPluginOptions({
				template: SRC_INDEX_PATH,
				title: `${TITLE} Upload Client`,
			}),
		),
	],
}

const configuration =
	merge(baseConfiguration, uploadConfiguration)

export default configuration