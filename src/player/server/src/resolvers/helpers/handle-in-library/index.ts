import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { ArtistID, PlaylistID, SongID, UserID } from "@oly_op/musicloud-common/build/types";
import { PoolOrClient } from "@oly_op/pg-helpers/build";

import { Artist, Playlist, Song } from "../../../types";
import { handleInLibrary } from "./base";

type HandleObjectInLibraryFunction<ObjectOptions, Return> = (
	pg: PoolOrClient,
) => (options: UserID) => (objectOptions: ObjectOptions) => Promise<Return>;

export const addSongToLibraryHelper: HandleObjectInLibraryFunction<SongID, Song> =
	pg =>
	({ userID }) =>
	({ songID }) =>
		handleInLibrary(pg)({
			inLibrary: true,
			userID,
			objectID: songID,
			typeName: "song",
			tableName: "songs",
			columnName: "song_id",
			columnNames: COLUMN_NAMES.SONG,
		});

export const addArtistToLibraryHelper: HandleObjectInLibraryFunction<ArtistID, Artist> =
	pg =>
	({ userID }) =>
	({ artistID }) =>
		handleInLibrary(pg)({
			userID,
			inLibrary: true,
			objectID: artistID,
			typeName: "artist",
			tableName: "artists",
			columnName: "artist_id",
			columnNames: COLUMN_NAMES.ARTIST,
		});

export const addPlaylistToLibraryHelper: HandleObjectInLibraryFunction<PlaylistID, Playlist> =
	pg =>
	({ userID }) =>
	({ playlistID }) =>
		handleInLibrary(pg)({
			userID,
			inLibrary: true,
			objectID: playlistID,
			typeName: "playlist",
			tableName: "playlists",
			columnName: "playlist_id",
			columnNames: COLUMN_NAMES.PLAYLIST,
		});

export const removeSongFromLibraryHelper: HandleObjectInLibraryFunction<SongID, Song> =
	pg =>
	({ userID }) =>
	({ songID }) =>
		handleInLibrary(pg)({
			userID,
			inLibrary: false,
			objectID: songID,
			typeName: "song",
			tableName: "songs",
			columnName: "song_id",
			columnNames: COLUMN_NAMES.SONG,
		});

export const removeArtistFromLibraryHelper: HandleObjectInLibraryFunction<ArtistID, Artist> =
	pg =>
	({ userID }) =>
	({ artistID }) =>
		handleInLibrary(pg)({
			userID,
			inLibrary: false,
			objectID: artistID,
			typeName: "artist",
			tableName: "artists",
			columnName: "artist_id",
			columnNames: COLUMN_NAMES.ARTIST,
		});

export const removePlaylistFromLibraryHelper: HandleObjectInLibraryFunction<PlaylistID, Playlist> =
	pg =>
	({ userID }) =>
	({ playlistID }) =>
		handleInLibrary(pg)({
			userID,
			inLibrary: false,
			objectID: playlistID,
			typeName: "playlist",
			tableName: "playlists",
			columnName: "playlist_id",
			columnNames: COLUMN_NAMES.PLAYLIST,
		});
