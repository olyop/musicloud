import { ApolloClient } from "@apollo/client";

import { SetCurrentDownload, SetStatus } from "../types";
import downloadSongs from "./songs";

const downloadLibrary =
	(client: ApolloClient<unknown>) =>
	async (setCurrentDownload: SetCurrentDownload, setStatus: SetStatus) => {
		await downloadSongs(client)(setCurrentDownload, setStatus);
	};

export default downloadLibrary;
