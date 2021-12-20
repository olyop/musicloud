import { AlbumBase } from "@oly_op/music-app-common/types"

import { Item } from "../../types"

export interface AlbumCover {
	cover?: File,
}

export interface Album extends Pick<AlbumBase, "title">, AlbumCover {
	artists: Item[],
	released: string,
}