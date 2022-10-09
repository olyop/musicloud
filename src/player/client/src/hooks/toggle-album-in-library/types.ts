import { AlbumID } from "@oly_op/musicloud-common/build/types";

import { Album, InLibraryBase } from "../../types";

interface QueryDataPick extends AlbumID, InLibraryBase {}

export interface QueryData {
	getAlbumByID: QueryDataPick;
}

export interface AddData {
	addAlbumToLibrary: Album;
}

export interface RemoveData {
	removeAlbumFromLibrary: Album;
}
