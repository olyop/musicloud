import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { ObjectID, ObjectTypeNames, UserID } from "@oly_op/musicloud-common/build/types";

type ColumnNames =
	| typeof COLUMN_NAMES.SONG[0]
	| typeof COLUMN_NAMES.ARTIST[0]
	| typeof COLUMN_NAMES.PLAYLIST[0];
type TableNames = "songs" | "artists" | "playlists";
type ColumnKeys = "songID" | "artistID" | "playlistID";
type TypeNames = Extract<ObjectTypeNames, "Song" | "Artist" | "Playlist">;
type LibraryTableNames = "library_songs" | "library_artists" | "library_playlists";

export interface HandleInLibraryOptions extends UserID, ObjectID {
	inLibrary: boolean;
	returnQuery?: string;
	columnNames: readonly string[];
	tableName: TableNames;
	columnKey: ColumnKeys;
	typeName: TypeNames;
	libraryTableName: LibraryTableNames;
	columnName: ColumnNames;
}
