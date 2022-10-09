import path from "path";
import { merge } from "webpack-merge";
import { Configuration } from "webpack";
import HTMLWebpackPlugin from "html-webpack-plugin";
import { TITLE } from "@oly_op/musicloud-common/build/metadata";

import baseConfiguration, {
	BASE_SRC_PATH,
	BASE_BUILD_PATH,
	createTSLoaderRule,
	createDevServerProxy,
	createHTMLPluginOptions,
} from "../base";

const ROOT_PATH = path.join(BASE_SRC_PATH, "authenticator", "client");

const SRC_PATH = path.join(ROOT_PATH, "src");

const SRC_ENTRY_PATH = path.join(SRC_PATH, "index.tsx");

const SRC_INDEX_PATH = path.join(SRC_PATH, "index.html");

const TSCONFIG_PATH = path.join(ROOT_PATH, "tsconfig.json");

const BUILD_PATH = path.join(BASE_BUILD_PATH, "authenticator", "public");

const configuration: Configuration = {
	entry: SRC_ENTRY_PATH,
	output: {
		path: BUILD_PATH,
	},
	module: {
		rules: [createTSLoaderRule(TSCONFIG_PATH)],
	},
	devServer: {
		port: parseInt(process.env.AUTHENTICATOR_CLIENT_PORT),
		proxy: createDevServerProxy(process.env.AUTHENTICATOR_SERVER_PORT, [
			"/api/log-in",
			"/api/sign-up",
			"/api/check-email-address-exists",
		]),
	},
	plugins: [
		new HTMLWebpackPlugin(
			createHTMLPluginOptions({
				template: SRC_INDEX_PATH,
				title: `${TITLE} Authenticator`,
			}),
		),
	],
};

export default merge(baseConfiguration, configuration);
