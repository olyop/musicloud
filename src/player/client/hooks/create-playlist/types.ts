import { Modifier, Reference } from "@apollo/client/cache"
import { PlaylistBase, InterfaceWithInput } from "@oly_op/music-app-common/types"
import { ApolloCache, MutationResult, MutationUpdaterFunction } from "@apollo/client"

import { HandlerReturn, Playlist } from "../../types"

export type PlaylistDataPick =
	Pick<Playlist, "__typename" | "songsTotal" | "inLibrary" | "dateCreated">

export interface PlaylistData extends
	PlaylistBase, PlaylistDataPick {}

export interface CreatePlaylistData {
	createPlaylist: PlaylistData,
}

export type CreatePlayliistInput =
	Pick<Playlist, "title">

export type CreatePlaylistVars =
	InterfaceWithInput<CreatePlayliistInput>

export type UseCreatePlaylistResult = [
	createPlaylist: (input: CreatePlayliistInput) => HandlerReturn,
	result: MutationResult<CreatePlaylistData>,
]

export type CreatePlaylistModifer =
	Modifier<(Reference | PlaylistDataPick)[] | null>

export type CreatePlaylistUpdate =
	MutationUpdaterFunction<
		CreatePlaylistData,
		CreatePlaylistVars,
		unknown,
		ApolloCache<unknown>
	>