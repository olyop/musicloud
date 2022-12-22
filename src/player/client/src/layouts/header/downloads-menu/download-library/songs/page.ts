import { ApolloClient } from "@apollo/client";
import { SongID } from "@oly_op/musicloud-common/build/types";

import GET_SONG_PAGE from "../../../../../pages/song/get-song-page.gql";

export const downloadSongPage = async (client: ApolloClient<unknown>, { songID }: SongID) => {
	await client.query({
		query: GET_SONG_PAGE,
		variables: {
			songID,
		},
	});
};
