import { AlbumIDBase } from "@oly_op/music-app-common/types"

import { Album, Handler, InLibraryBase } from "../../types"

export type UseToggleAlbumInLibrary = [
	toggleAlbumInLibrary: Handler,
	inLibrary: boolean,
]

interface GetAlbumInLibraryDataPick
	extends AlbumIDBase, InLibraryBase {}

export interface GetAlbumInLibraryData {
	getAlbumByID: GetAlbumInLibraryDataPick,
}

export interface AddAlbumToLibraryData {
	addAlbumToLibrary: Album,
}

export interface RemoveAlbumFromLibraryData {
	removeAlbumFromLibrary: Album,
}