import { Dispatch, SetStateAction } from "react";

import {
	AlbumsOrderByField,
	LibrarySongsOrderByField,
	OrderBy,
	Song,
	SongsOrderByField,
} from "../../../types";

export type Status = [number, number];
export type SetDownloadText = Dispatch<SetStateAction<string | null>>;
export type SetDownloadStatus = Dispatch<SetStateAction<Status | null>>;
export type SetCurrentDownload = Dispatch<SetStateAction<Song | null>>;

export interface DownloadSongsOrderByOptions {
	songsOrderBy: OrderBy<SongsOrderByField>;
}

export interface DownloadAlbumsOrderByOptions {
	albumsOrderBy: OrderBy<AlbumsOrderByField>;
}

export interface DownloadArtistPageOrderByOptions
	extends DownloadSongsOrderByOptions,
		DownloadAlbumsOrderByOptions {}

export interface DownloadOptions extends DownloadArtistPageOrderByOptions {
	setDownloadText: SetDownloadText;
	setDownloadStatus: SetDownloadStatus;
	setCurrentDownload: SetCurrentDownload;
	librarySongsOrderBy: OrderBy<LibrarySongsOrderByField>;
}
