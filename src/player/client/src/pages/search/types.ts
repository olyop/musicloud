/* eslint-disable @typescript-eslint/ban-types */

import {
	AlgoliaRecord,
	AlgoliaRecordUser,
	AlgoliaRecordSong,
	AlgoliaRecordGenre,
	AlgoliaRecordAlbum,
	AlgoliaRecordArtist,
	AlgoliaRecordPlaylist,
} from "@oly_op/musicloud-common/build/types";

import { SearchIndex } from "algoliasearch";

type AlgoliaHit<T> = T &
	Parameters<
		Extract<Parameters<ReturnType<SearchIndex["search"]>["then"]>[0], Function>
	>[0]["hits"][0];

export type Hit = AlgoliaHit<AlgoliaRecord>;

export type HitUser = AlgoliaHit<AlgoliaRecordUser>;

export type HitSong = AlgoliaHit<AlgoliaRecordSong>;

export type HitGenre = AlgoliaHit<AlgoliaRecordGenre>;

export type HitAlbum = AlgoliaHit<AlgoliaRecordAlbum>;

export type HitArtist = AlgoliaHit<AlgoliaRecordArtist>;

export type HitPlaylist = AlgoliaHit<AlgoliaRecordPlaylist>;
