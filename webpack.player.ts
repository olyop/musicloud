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
const SERVICE_WORKER_PATH = path.join(CLIENT_PATH, "service-worker.ts")

const ANALYZE_BUNDLE = process.env.ANALYZE_BUNDLE === "true"
const SERVICE_WORKER = process.env.SERVICE_WORKER === "true"
const BUILD_PATH = path.join(BASE_BUILD_PATH, "player", "public")

const proxy = [
	"/graphql",
	"/ping.txt",
	"/icons/192.png",
	"/icons/512.png",
	"/service-worker.js",
	"/manifest.webmanifest",
]

const config = merge(baseConfig, {
	entry: ROOT_PATH,
	output: {
		path: BUILD_PATH,
	},
	devServer: {
		port: parseInt(process.env.PLAYER_CLIENT_PORT!),
		proxy: [{
			logLevel: "silent",
			context: [ ...baseProxy, ...proxy ],
			target: `http://${process.env.HOST!}:${process.env.PLAYER_SERVER_PORT!}`,
		}],
	},
	plugins: [
		...(ANALYZE_BUNDLE ? [
			new BundleAnalyzerPlugin({
				openAnalyzer: true,
				defaultSizes: "gzip",
				analyzerMode: "static",
			}),
		] : []),
		...(SERVICE_WORKER ? [
			new InjectManifest({
				swSrc: SERVICE_WORKER_PATH,
				maximumFileSizeToCacheInBytes: 1000 * 1024 * 1024,
			}),
		] : []),
		new HTMLWebpackPlugin({
			...baseHTMLPluginOptions(TITLE),
			template: ENTRY_PATH,
		}),
	],
})

export default config