import { PlaylistID } from "@oly_op/music-app-common/types"
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