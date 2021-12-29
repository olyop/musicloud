import {
	AlgoliaRecord,
	AlgoliaRecordUser,
	AlgoliaRecordSong,
	AlgoliaRecordGenre,
	AlgoliaRecordAlbum,
	AlgoliaRecordArtist,
	AlgoliaRecordPlaylist,
} from "@oly_op/music-app-common/types"

import { Hit as AlgoliaHit } from "algoliasearch"

export type Hit =
	AlgoliaHit<AlgoliaRecord>

export type HitUser =
	AlgoliaHit<AlgoliaRecordUser>

export type HitSong =
	AlgoliaHit<AlgoliaRecordSong>

export type HitGenre =
	AlgoliaHit<AlgoliaRecordGenre>

export type HitAlbum =
	AlgoliaHit<AlgoliaRecordAlbum>

export type HitArtist =
	AlgoliaHit<AlgoliaRecordArtist>

export type HitPlaylist =
	AlgoliaHit<AlgoliaRecordPlaylist>