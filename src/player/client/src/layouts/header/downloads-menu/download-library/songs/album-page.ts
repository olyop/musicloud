import { ApolloClient } from "@apollo/client";
import { AlbumID } from "@oly_op/musicloud-common/build/types";

import GET_ALBUM_PAGE from "../../../../../pages/album/get-album-page.gql";

export const downloadAlbumPage = async (client: ApolloClient<unknown>, { albumID }: AlbumID) => {
	await client.query({
		query: GET_ALBUM_PAGE,
		variables: {
			albumID,
		},
	});
};
