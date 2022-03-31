import { AlbumBase, SongBase } from "@oly_op/musicloud-common"

import { BodyEntry } from "../../types"

export interface Item {
	index: number,
	value: string,
}

export type List = Item[]

export interface Album extends Pick<AlbumBase, "title">, Record<string, unknown> {
	songs: string,
	artists: string,
	released: string,
	cover: BodyEntry[],
}

export interface Route {
	Body: Album,
}

export type SongBaseBase =
	Omit<SongBase, "songID" | "bpm" | "key" | "duration">

export interface Song extends SongBaseBase {
	genres: List,
	artists: List,
	remixers: List,
	featuring: List,
}