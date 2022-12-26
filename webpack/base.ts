import { readFile } from "node:fs/promises";
import path from "node:path";

import type { WithRequired } from "@apollo/utils.withrequired";
import { IS_DEVELOPMENT, IS_PRODUCTION, USE_HTTPS } from "@oly_op/musicloud-common/build/globals";
import { DESCRIPTION, KEYWORDS } from "@oly_op/musicloud-common/build/metadata";
import CompressionPlugin from "compression-webpack-plugin";
import CSSMinimizerPlugin from "css-minimizer-webpack-plugin";
import DotenvPlugin from "dotenv-webpack";
import ESLintPlugin from "eslint-webpack-plugin";
import { Options as HTMLWebpackPluginOptions } from "html-webpack-plugin";
import MiniCSSExtractPlugin from "mini-css-extract-plugin";
import ms from "ms";
import StylelintPlugin from "stylelint-webpack-plugin";
import { Options as TSLoaderOptions } from "ts-loader";
import webpack, { RuleSetRule } from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { ProxyConfigArrayItem } from "webpack-dev-server";

import packageDotJSON from "../package.json" assert { type: "json" };

export const BASE_ROOT_PATH = process.cwd();
export const BASE_SRC_PATH = path.join(BASE_ROOT_PATH, "src");
export const BASE_BUILD_PATH = path.join(BASE_ROOT_PATH, "build");

export const createHTMLPluginOptions = ({
	title,
	...options
}: WithRequired<HTMLWebpackPluginOptions, "title">): HTMLWebpackPluginOptions => ({
	title,
	minify: IS_PRODUCTION,
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
});

export const createTSLoaderRule = (
	configFile: Pick<TSLoaderOptions, "configFile">["configFile"],
): RuleSetRule => ({
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
		},
	},
});

export const createDevelopmentServerProxy = (
	port: string,
	proxy: string[],
): ProxyConfigArrayItem => ({
	secure: false,
	logLevel: "silent",
	timeout: ms("120s"),
	proxyTimeout: ms("120s"),
	onProxyReq: (proxyRequest, request) => request.setTimeout(ms("120s")),
	target: `${USE_HTTPS ? "https" : "http"}://${process.env.HOST}:${port}`,
	context: ["/icon.png", "/robots.txt", "/favicon.ico", "/security.txt", ...proxy],
});

const firstCSSLoader = IS_DEVELOPMENT ? "style-loader" : MiniCSSExtractPlugin.loader;

const baseConfiguration: webpack.Configuration = {
	devtool: false,
	stats: "errors-only",
	mode: process.env.NODE_ENV,
	devServer: {
		static: false,
		host: process.env.HOST,
		historyApiFallback: true,
		client: {
			logging: "none",
		},
		server:
			process.env.HTTPS === "true"
				? {
						type: "https",
						options: {
							cert: await readFile(process.env.TLS_CERTIFICATE_PATH),
							key: await readFile(process.env.TLS_CERTIFICATE_KEY_PATH),
						},
				  }
				: undefined,
	},
	output: {
		publicPath: "/",
		filename: "index-[fullhash].js",
	},
	resolve: {
		symlinks: false,
		fullySpecified: false,
		extensions: [".js", ".ts", ".tsx", ".css"],
	},
	watchOptions: {
		ignored: "/node_modules/",
	},
	experiments: {
		topLevelAwait: true,
	},
	module: {
		rules: [
			{
				test: /\.m?js/,
				resolve: {
					fullySpecified: false,
				},
			},
			{
				test: /\.css$/,
				use: [firstCSSLoader, "css-loader"],
			},
			{
				test: /\.scss$/,
				use: [firstCSSLoader, "css-loader", "sass-loader"],
			},
		],
	},
	plugins: [
		new DotenvPlugin(),
		new webpack.DefinePlugin({
			AUTHOR: JSON.stringify(packageDotJSON.author.name),
			VERSION: JSON.stringify(packageDotJSON.version),
		}),
		...(process.env.LINTING_IN_BUILD === "true"
			? [
					new StylelintPlugin({
						extensions: ["scss"],
					}),
					new ESLintPlugin({
						extensions: ["ts", "tsx", ".gql"],
					}),
			  ]
			: []),
		...(IS_DEVELOPMENT
			? []
			: [
					new CompressionPlugin(),
					new CSSMinimizerPlugin(),
					new MiniCSSExtractPlugin({
						filename: "index-[fullhash].css",
					}),
			  ]),
		...(process.env.ANALYZE_BUNDLE === "true"
			? [
					new BundleAnalyzerPlugin({
						logLevel: "silent",
						openAnalyzer: true,
						defaultSizes: "gzip",
						analyzerMode: "static",
					}),
			  ]
			: []),
	],
};

export default baseConfiguration;
