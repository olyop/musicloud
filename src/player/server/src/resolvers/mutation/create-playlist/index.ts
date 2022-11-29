import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { AlgoliaRecordPlaylist, InterfaceWithInput } from "@oly_op/musicloud-common/build/types";
import { addPrefix, convertFirstRowToCamelCase, importSQL, query } from "@oly_op/pg-helpers";

import { Playlist } from "../../../types";
import { getUser, handleInLibrary } from "../../helpers";
import resolver from "../resolver";

const isf = importSQL(import.meta.url);

const INSERT_PLAYLIST = await isf("insert-playlist");

type Args = InterfaceWithInput<Pick<Playlist, "title" | "privacy">>;

export const createPlaylist = resolver<Playlist, Args>(async ({ args, context }) => {
	const { input } = args;
	const { title, privacy } = input;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const playlist = await query(context.pg)(INSERT_PLAYLIST)({
		parse: convertFirstRowToCamelCase<Playlist>(),
		variables: {
			userID,
			privacy,
			title: [title, [true]],
			columnNames: addPrefix(COLUMN_NAMES.PLAYLIST),
		},
	});

	const { playlistID } = playlist;

	await handleInLibrary(context.pg)({
		columnKey: "playlistID",
		columnName: "playlist_id",
		columnNames: COLUMN_NAMES.PLAYLIST,
		inLibrary: true,
		libraryTableName: "library_playlists",
		objectID: playlistID,
		userID,
		tableName: "playlists",
		typeName: "Playlist",
	});

	const { name } = await getUser(context.pg)({ userID });

	const algoliaRecord: AlgoliaRecordPlaylist = {
		title,
		privacy,
		plays: 0,
		typeName: "Playlist",
		objectID: playlistID,
		user: { userID, name },
	};

	await context.ag.index.saveObject(algoliaRecord);

	return playlist;
});
