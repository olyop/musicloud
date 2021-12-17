import { Modifier, Reference } from "@apollo/client/cache"
import { PlaylistBase, InterfaceWithInput } from "@oly_op/music-app-common/types"
import { ApolloCache, MutationResult, MutationUpdaterFunction } from "@apollo/client"

import { HandlerReturn, Playlist } from "../../types"

export type PlaylistDataPick =
	Pick<Playlist, "__typename" | "songsTotal" | "inLibrary" | "dateCreated">

export interface PlaylistData extends
	PlaylistBase, PlaylistDataPick {}

export interface Data {
	createPlaylist: PlaylistData,
}

export type Input =
	Pick<Playlist, "title" | "privacy">

export type Vars =
	InterfaceWithInput<Input>

export type Result = [
	createPlaylist: (input: Input) => HandlerReturn,
	result: MutationResult<Data>,
]

export type Modifer =
	Modifier<(Reference | PlaylistDataPick)[] | null>

export type Update =
	MutationUpdaterFunction<
		Data,
		Vars,
		unknown,
		ApolloCache<unknown>
	>