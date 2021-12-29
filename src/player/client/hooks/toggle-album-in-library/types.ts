import { AlbumID } from "@oly_op/music-app-common/types"

import { Album, HandlerPromise, InLibraryBase } from "../../types"

export type Result = [
	toggleAlbumInLibrary: HandlerPromise,
	inLibrary: boolean,
]

interface QueryDataPick
	extends AlbumID, InLibraryBase {}

export interface QueryData {
	getAlbumByID: QueryDataPick,
}

export interface AddData {
	addAlbumToLibrary: Album,
}

export interface RemoveData {
	removeAlbumFromLibrary: Album,
}