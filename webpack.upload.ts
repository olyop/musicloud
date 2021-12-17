import path from "path"
import { merge } from "webpack-merge"
import HTMLWebpackPlugin from "html-webpack-plugin"
import { TITLE } from "@oly_op/music-app-common/metadata"

import {
	baseProxy,
	baseConfig,
	BASE_SRC_PATH,
	BASE_BUILD_PATH,
	baseHTMLPluginOptions,
} from "./webpack.base"

const SRC_PATH = path.join(BASE_SRC_PATH, "upload")

const CLIENT_PATH = path.join(SRC_PATH, "client")
const ROOT_PATH = path.join(CLIENT_PATH, "index.tsx")
const ENTRY_PATH = path.join(CLIENT_PATH, "index.html")

const BUILD_PATH = path.join(BASE_BUILD_PATH, "upload", "public")

const proxy = [
	"/upload/user",
	"/upload/album",
	"/upload/genre",
	"/upload/artist",
]

const config = merge(baseConfig, {
	entry: ROOT_PATH,
	output: {
		path: BUILD_PATH,
	},
	devServer: {
		port: parseInt(process.env.UPLOAD_CLIENT_PORT),
		proxy: [{
			logLevel: "silent",
			context: [ ...baseProxy, ...proxy ],
			target: `http://${process.env.HOST}:${process.env.UPLOAD_SERVER_PORT}`,
		}],
	},
	plugins: [
		new HTMLWebpackPlugin({
			...baseHTMLPluginOptions(`${TITLE} Upload Client`),
			template: ENTRY_PATH,
		}),
	],
})

export default config