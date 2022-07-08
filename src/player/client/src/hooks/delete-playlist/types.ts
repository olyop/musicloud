import { PlaylistID } from "@oly_op/musicloud-common"
import { ApolloCache, MutationUpdaterFunction } from "@apollo/client"

export interface DeletePlaylistData {
	deletePlaylistByID: null,
}

export type DeletePlaylistUpdate =
	MutationUpdaterFunction<
		DeletePlaylistData,
		PlaylistID,
		unknown,
		ApolloCache<unknown>
	>