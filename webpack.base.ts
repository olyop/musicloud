/* eslint-disable quote-props */
import path from "path"
import { KEYWORDS, DESCRIPTION } from "@oly_op/music-app-common/metadata"

import { Configuration } from "webpack"
import DotenvPlugin from "dotenv-webpack"
import CompressionPlugin from "compression-webpack-plugin"
import MiniCSSExtractPlugin from "mini-css-extract-plugin"
import CSSMinimizerPlugin from "css-minimizer-webpack-plugin"
import { Options as HTMLWebpackPluginOptions } from "html-webpack-plugin"

type NodeEnv = "development" | "production"

const NODE_ENV = process.env.NODE_ENV! as NodeEnv
const IS_DEV = NODE_ENV === "development"

const HOST = process.env.HOST!

const ROOT_PATH = __dirname
export const BASE_SRC_PATH = path.join(ROOT_PATH, "src")
export const BASE_BUILD_PATH = path.join(ROOT_PATH, "build")

export const baseHTMLPluginOptions =
	(title: string): HTMLWebpackPluginOptions => ({
		title,
		minify: true,
		filename: "index.html",
		meta: {
			"og:type": "PWA",
			"og:title": title,
			"twitter:dnt": "on",
			"keywords": KEYWORDS,
			"google": "notranslate",
			"robots": "index,follow",
			"theme-color": "#ffffff",
			"application-name": title,
			"author": "Oliver Plummer",
			"description": DESCRIPTION,
			"og:image": "/icons/192.png",
			"og:description": DESCRIPTION,
			"mobile-web-app-capable": "yes",
			"viewport": `
				minimum-scale=1,
				initial-scale=1,
				shrink-to-fit=no,
				width=device-width
			`,
		},
	})

export const baseProxy = [
	"/robots.txt",
	"/favicon.ico",
	"/security.txt",
]

export const baseConfig: Configuration = {
	mode: NODE_ENV,
	devtool: IS_DEV ? "inline-source-map" : false,
	output: {
		publicPath: "/",
		filename: "[fullhash].js",
	},
	ignoreWarnings: [
		/Failed to parse source map/,
	],
	devServer: {
		hot: true,
		host: HOST,
		historyApiFallback: true,
	},
	resolve: {
		symlinks: false,
		extensions: [".js", ".ts", ".tsx"],
	},
	module: {
		rules: [{
			test: /\.js$/,
			enforce: "pre",
			loader: "source-map-loader",
		},{
			test: /\.gql$/,
			exclude: /node_modules/,
			loader: "graphql-tag/loader",
		},{
			test: /\.tsx?$/,
			loader: "ts-loader",
			exclude: /node_modules/,
			options: {
				onlyCompileBundledFiles: true,
			},
		},{
			test: /\.css$/,
			use: [
				IS_DEV ? "style-loader" : MiniCSSExtractPlugin.loader,
				"css-loader",
			],
		},{
			test: /\.scss$/,
			use: [
				IS_DEV ? "style-loader" : MiniCSSExtractPlugin.loader,
				"css-loader",
				"sass-loader",
			],
		}],
	},
	plugins: [
		new DotenvPlugin(),
		...(IS_DEV ? [] : [
			new CompressionPlugin(),
			new CSSMinimizerPlugin(),
			new MiniCSSExtractPlugin({ filename: "[hash].css" }),
		]),
	],
}