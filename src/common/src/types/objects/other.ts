import { SongBase } from "./bases"

export type ObjectTypeNames =
	"Key" | "User" | "Play" | "Song" | "Genre" | "Album" | "Artist" | "Playlist"

export type Nullable<T> = { [K in keyof T]: T[K] | null }

interface SongAudioMetadataInternal
	extends
	Pick<SongBase, "mix" | "title" | "trackNumber" | "discNumber"> {
	year: number,
	album: string,
	genres: string[],
	artists: string[],
}

export type SongAudioMetadataBase =
	Nullable<SongAudioMetadataInternal>