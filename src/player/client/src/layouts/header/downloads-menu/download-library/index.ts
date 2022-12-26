import { ApolloClient } from "@apollo/client";

import { DownloadOptions } from "../types";
import downloadSongs from "./songs";

const downloadLibrary = (client: ApolloClient<unknown>) => async (options: DownloadOptions) => {
	await downloadSongs(client)(options);
};
export default downloadLibrary;
