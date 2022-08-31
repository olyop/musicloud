import path from "path"
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
	path.join(BASE_SRC_PATH, "uploader", "client")

const SRC_PATH =
	path.join(ROOT_PATH, "src")

const SRC_ENTRY_PATH =
	path.join(SRC_PATH, "index.tsx")

const SRC_INDEX_PATH =
	path.join(SRC_PATH, "index.html")

const TSCONFIG_PATH =
	path.join(ROOT_PATH, "tsconfig.json")

const BUILD_PATH =
	path.join(BASE_BUILD_PATH, "uploader", "public")

const configuration: Configuration = {
	entry: SRC_ENTRY_PATH,
	output: {
		path: BUILD_PATH,
	},
	module: {
		rules: [
			createTSLoaderRule(TSCONFIG_PATH),
		],
	},
	devServer: {
		port: parseInt(process.env.UPLOADER_CLIENT_PORT),
		proxy: createDevServerProxy(process.env.UPLOADER_SERVER_PORT, [
			"/api/upload/album",
			"/api/upload/genre",
			"/api/upload/artist",
			"/api/audio-metadata",
			"/api/check/country-exists",
			"/api/check/genre-name-exists",
			"/api/check/artist-name-exists",
		]),
	},
	plugins: [
		new HTMLWebpackPlugin(
			createHTMLPluginOptions({
				template: SRC_INDEX_PATH,
				title: `${TITLE} Uploader`,
			}),
		),
	],
}

export default merge(baseConfiguration, configuration)