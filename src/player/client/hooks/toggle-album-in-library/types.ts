import { AlbumID } from "@oly_op/music-app-common/types"

import { Album, Handler, InLibraryBase } from "../../types"

export type UseToggleAlbumInLibrary = [
	toggleAlbumInLibrary: Handler,
	inLibrary: boolean,
]

interface GetAlbumInLibraryDataPick
	extends AlbumID, InLibraryBase {}

export interface GetAlbumInLibraryData {
	getAlbumByID: GetAlbumInLibraryDataPick,
}

export interface AddAlbumToLibraryData {
	addAlbumToLibrary: Album,
}

export interface RemoveAlbumFromLibraryData {
	removeAlbumFromLibrary: Album,
}