import { PlaylistID } from "@oly_op/musicloud-common/build/types"
import { ApolloCache, MutationUpdaterFunction } from "@apollo/client"

export interface Data {
	deletePlaylistByID: null,
}

export type Update =
	MutationUpdaterFunction<
		Data,
		PlaylistID,
		unknown,
		ApolloCache<unknown>
	>