import { Reference } from "@apollo/client/cache"
import { Modifier } from "@apollo/client/cache/core/types/common"
import { ApolloCache, MutationUpdaterFunction } from "@apollo/client"
import { PlaylistBase, InterfaceWithInput } from "@oly_op/musicloud-common/build/types"

import { Playlist } from "../../types"

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

export type Modifer =
	Modifier<(Reference | PlaylistDataPick)[] | null>

export type Update =
	MutationUpdaterFunction<
		Data,
		Vars,
		unknown,
		ApolloCache<unknown>
	>