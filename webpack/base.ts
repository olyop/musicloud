import ms from "ms"
import path from "node:path"
import { readFileSync } from "node:fs"
import DotenvPlugin from "dotenv-webpack"
import webpack, { RuleSetRule } from "webpack"
import ESLintPlugin from "eslint-webpack-plugin"
import StylelintPlugin from "stylelint-webpack-plugin"
import { Options as TSLoaderOptions } from "ts-loader"
import { ProxyConfigArrayItem } from "webpack-dev-server"
import CompressionPlugin from "compression-webpack-plugin"
import MiniCSSExtractPlugin from "mini-css-extract-plugin"
import CSSMinimizerPlugin from "css-minimizer-webpack-plugin"
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"
import type { WithRequired } from "@apollo/utils.withrequired"
import { Options as HTMLWebpackPluginOptions } from "html-webpack-plugin"
import { KEYWORDS, DESCRIPTION } from "@oly_op/musicloud-common/build/metadata"

import packageDotJSON from "../package.json" assert { type: "json" }

export const IS_DEV =
	process.env.NODE_ENV === "development"

export const BASE_ROOT_PATH =
	process.cwd()

export const BASE_SRC_PATH =
	path.join(BASE_ROOT_PATH, "src")

export const BASE_BUILD_PATH =
	path.join(BASE_ROOT_PATH, "build")

export const createHTMLPluginOptions =
	({ title, ...options }: WithRequired<HTMLWebpackPluginOptions, "title">): HTMLWebpackPluginOptions => ({
		title,
		minify: false,
		filename: "index.html",
		meta: {
			"og:title": title,
			"keywords": KEYWORDS,
			"og:image": "/icon.png",
			"application-name": title,
			"description": DESCRIPTION,
			"og:description": DESCRIPTION,
		},
		...options,
	})

export const createTSLoaderRule =
	({ configFile, ...options }: WithRequired<Partial<TSLoaderOptions>, "configFile">): RuleSetRule => ({
		exclude: /node_modules/,
		test: /\.tsx?$/,
		resolve: {
			fullySpecified: false,
		},
		use: {
			loader: "ts-loader",
			options: {
				configFile,
				onlyCompileBundledFiles: true,
				...options,
			},
		},
	})

export const createDevServerProxy =
	(port: string, proxy: string[]): ProxyConfigArrayItem => ({
		logLevel: "silent",
		timeout: ms("120s"),
		proxyTimeout: ms("120s"),
		secure: process.env.USE_HTTPS ? false : undefined,
		onProxyReq: (proxyRequest, request) => request.setTimeout(ms("120s")),
		target: `${process.env.USE_HTTPS ? "https" : "http"}://${process.env.HOST}:${port}`,
		context: [
			"/icon.png",
			"/robots.txt",
			"/favicon.ico",
			"/security.txt",
			...proxy,
		],
	})

const firstCSSLoader =
	IS_DEV ?
		"style-loader" :
		MiniCSSExtractPlugin.loader

const baseConfiguration: webpack.Configuration = {
	devtool: false,
	stats: "errors-only",
	mode: process.env.NODE_ENV,
	devServer: {
		static: false,
		host: process.env.HOST,
		historyApiFallback: true,
		client: { logging: "error" },
		server: process.env.USE_HTTPS === "true" ? {
			type: "https",
			options: {
				cert: readFileSync(process.env.TLS_CERTIFICATE_PATH),
				key: readFileSync(process.env.TLS_CERTIFICATE_KEY_PATH),
			},
		} : undefined,
	},
	output: {
		publicPath: "/",
		filename: "index-[fullhash].js",
	},
	resolve: {
		symlinks: false,
		fullySpecified: false,
		extensions: [".js", ".ts", ".tsx"],
	},
	watchOptions: {
		ignored: "/node_modules/",
	},
	experiments: {
		topLevelAwait: true,
	},
	module: {
		rules: [{
			test: /\.css$/,
			use: [
				firstCSSLoader,
				"css-loader",
			],
		},{
			test: /\.scss$/,
			use: [
				firstCSSLoader,
				"css-loader",
				"sass-loader",
			],
		},{
			test: /\.(cj|mj|j)s/,
			resolve: {
				fullySpecified: false,
			},
		}],
	},
	plugins: [
		new DotenvPlugin(),
		new webpack.DefinePlugin({
			VERSION: JSON.stringify(packageDotJSON.version),
		}),
		...(process.env.LINTING_IN_BUILD === "true" ? [
			new StylelintPlugin({
				extensions: ["scss"],
			}),
			new ESLintPlugin({
				extensions: ["ts", "tsx", ".gql"],
			}),
		] : []),
		...(IS_DEV ? [] : [
			new CompressionPlugin(),
			new CSSMinimizerPlugin(),
			new MiniCSSExtractPlugin({
				filename: "index-[fullhash].css",
			}),
		]),
		...(process.env.ANALYZE_BUNDLE === "true" ? [
			new BundleAnalyzerPlugin({
				logLevel: "silent",
				openAnalyzer: true,
				defaultSizes: "gzip",
				analyzerMode: "static",
			}),
		] : []),
	],
}

export default baseConfiguration