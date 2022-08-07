import { AlbumBase, SongBase } from "@oly_op/musicloud-common/build/types"

import { BodyEntry } from "../../types"

interface Body extends Pick<AlbumBase, "title"> {
	songs: string,
	artists: string,
	released: string,
	cover: BodyEntry[],
}

export interface Route {
	Body: Body,
}

export interface Item {
	index: number,
	value: string,
}

export type List =
	Item[]

export type SongBaseBase =
	Omit<SongBase, "songID" | "bpm" | "key" | "duration">

export interface Song extends SongBaseBase {
	genres: List,
	artists: List,
	remixers: List,
	featuring: List,
}