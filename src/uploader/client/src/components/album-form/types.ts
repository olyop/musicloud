import { AlbumBase, SongBase } from "@oly_op/musicloud-common/build/types";

import { Item } from "../../types";

export interface AlbumCover {
	cover?: File;
}

export interface Album extends Pick<AlbumBase, "title">, AlbumCover {
	artists: Item[];
	released: string;
	remixers: Item[];
}

interface SongAudio {
	audio?: File;
}

export interface SongLists {
	genres: Item[];
	artists: Item[];
	remixers: Item[];
	featuring: Item[];
}

export interface Song extends SongAudio, SongLists, Omit<SongBase, "bpm" | "songID" | "duration"> {}
