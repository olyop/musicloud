import { PlaylistIDBase } from "@oly_op/music-app-common/types"
import { ApolloCache, MutationResult, MutationUpdaterFunction } from "@apollo/client"

import { Handler } from "../../types"

export type UseDeletePlaylistResult = [
	deletePlaylist: Handler,
	result: MutationResult<DeletePlaylistData>,
]

export interface DeletePlaylistData {
	deletePlaylistByID: null,
}

export type DeletePlaylistUpdate =
	MutationUpdaterFunction<
		DeletePlaylistData,
		PlaylistIDBase,
		unknown,
		ApolloCache<unknown>
	>