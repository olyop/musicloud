import path from "path"
import { merge } from "webpack-merge"
import HTMLWebpackPlugin from "html-webpack-plugin"
import { InjectManifest } from "workbox-webpack-plugin"
import { TITLE } from "@oly_op/music-app-common/metadata"
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"

import {
	baseProxy,
	baseConfig,
	BASE_SRC_PATH,
	BASE_BUILD_PATH,
	baseHTMLPluginOptions,
} from "./webpack.base"

const SRC_PATH = path.join(BASE_SRC_PATH, "player")

const CLIENT_PATH = path.join(SRC_PATH, "client")
const ROOT_PATH = path.join(CLIENT_PATH, "index.tsx")
const ENTRY_PATH = path.join(CLIENT_PATH, "index.html")
const BUILD_PATH = path.join(BASE_BUILD_PATH, "player", "public")
const SERVICE_WORKER_PATH = path.join(CLIENT_PATH, "service-worker.ts")

const proxy = [
	"/graphql",
	"/ping.txt",
	"/icon.png",
	"/service-worker.js",
	"/manifest.webmanifest",
	"/search-by-algolia.png",
]

const config = merge(baseConfig, {
	entry: ROOT_PATH,
	output: {
		path: BUILD_PATH,
	},
	devServer: {
		port: parseInt(process.env.PLAYER_CLIENT_PORT),
		proxy: [{
			logLevel: "silent",
			// @ts-ignore
			context: [ ...baseProxy, ...proxy ],
			target: `http://${process.env.HOST}:${process.env.PLAYER_SERVER_PORT}`,
		}],
	},
	plugins: [
		...(process.env.ANALYZE_BUNDLE === "true" ? [
			new BundleAnalyzerPlugin({
				openAnalyzer: true,
				defaultSizes: "gzip",
				analyzerMode: "static",
			}),
		] : []),
		...(process.env.SERVICE_WORKER === "true" ? [
			new InjectManifest({
				swSrc: SERVICE_WORKER_PATH,
				maximumFileSizeToCacheInBytes: 1000 * 1024 * 1024,
			}),
		] : []),
		new HTMLWebpackPlugin({
			...baseHTMLPluginOptions(TITLE, true),
			template: ENTRY_PATH,
		}),
	],
})

export default config