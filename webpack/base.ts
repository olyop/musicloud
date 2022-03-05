/* eslint-disable quote-props */
import path from "path"
import { KEYWORDS, DESCRIPTION } from "@oly_op/music-app-common/metadata"

import DotenvPlugin from "dotenv-webpack"
import ESLintPlugin from "eslint-webpack-plugin"
import { Configuration, DefinePlugin } from "webpack"
import StylelintPlugin from "stylelint-webpack-plugin"
import { Options as TSLoaderOptions } from "ts-loader"
import { ProxyConfigArrayItem } from "webpack-dev-server"
import CompressionPlugin from "compression-webpack-plugin"
import MiniCSSExtractPlugin from "mini-css-extract-plugin"
import CSSMinimizerPlugin from "css-minimizer-webpack-plugin"
import { Options as HTMLWebpackPluginOptions } from "html-webpack-plugin"

import packageJSON from "../package.json"

export const IS_DEV =
	process.env.NODE_ENV === "development"

export const BASE_ROOT_PATH =
	process.cwd()

export const BASE_BUILD_PATH =
	path.join(BASE_ROOT_PATH, "build")

interface CreateHTMLWebpackPluginOptions
	extends
	Omit<HTMLWebpackPluginOptions, "tilte">,
	Required<Pick<HTMLWebpackPluginOptions, "title">> {}

export const createHTMLPluginOptions =
	({ title, ...options }: CreateHTMLWebpackPluginOptions): HTMLWebpackPluginOptions => ({
		title,
		minify: !IS_DEV,
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

interface CreateTSLoaderOptions
	extends
	Pick<TSLoaderOptions, "configFile">,
	Partial<Omit<TSLoaderOptions, "configFile">> {}

export const createTSLoaderOptions =
	({ configFile, ...options }: CreateTSLoaderOptions): Partial<TSLoaderOptions> => ({
		configFile,
		onlyCompileBundledFiles: true,
		...options,
	})

export const createDevServerProxy =
	(port: string, proxy: string[]): ProxyConfigArrayItem => ({
		logLevel: "silent",
		target: `http://${process.env.HOST}:${port}`,
		context: [
			"/icon.png",
			"/robots.txt",
			"/favicon.ico",
			"/security.txt",
			...proxy,
		]
	})

const finalCSSLoader =
	IS_DEV ? "style-loader" : MiniCSSExtractPlugin.loader

const baseConfiguration: Configuration = {
	stats: "errors-only",
	mode: process.env.NODE_ENV,
	devtool: IS_DEV && process.env.SOURCE_MAPS && "inline-source-map",
	devServer: {
		host: process.env.HOST,
		historyApiFallback: true,
		client: { logging: "error" },
	},
	output: {
		publicPath: "/",
		filename: "index-[fullhash].js",
	},
	resolve: {
		symlinks: false,
		extensions: [".js", ".ts", ".tsx"],
	},
	module: {
		rules: [{
			test: /\.css$/,
			use: [
				finalCSSLoader,
				"css-loader",
			],
		},{
			test: /\.scss$/,
			use: [
				finalCSSLoader,
				"css-loader",
				"sass-loader",
			],
		}],
	},
	plugins: [
		new DefinePlugin({
			VERSION: JSON.stringify(packageJSON.version),
		}),
		new DotenvPlugin(),
		...(IS_DEV ? [
			new ESLintPlugin({
				extensions: ["ts", "tsx"],
			}),
			new StylelintPlugin(),
		] : [
			new CompressionPlugin(),
			new CSSMinimizerPlugin(),
			new MiniCSSExtractPlugin({
				filename: "index-[fullhash].css",
			}),
		]),
	],
}

export default baseConfiguration