import { join, query, convertFirstRowToCamelCase } from "@oly_op/pg-helpers";
import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { AlgoliaRecordPlaylist, InterfaceWithInput } from "@oly_op/musicloud-common/build/types";

import resolver from "./resolver";
import { getUser } from "../helpers";
import { Playlist } from "../../types";
import { INSERT_PLAYLIST, INSERT_LIBRARY_OBJECT } from "../../sql";

type Args = InterfaceWithInput<Pick<Playlist, "title" | "privacy">>;

export const createPlaylist = resolver<Playlist, Args>(async ({ args, context }) => {
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);
	const {
		input: { title, privacy },
	} = args;

	const playlist = await query(context.pg)(INSERT_PLAYLIST)({
		parse: convertFirstRowToCamelCase<Playlist>(),
		variables: [
			{
				key: "userID",
				value: userID,
			},
			{
				key: "title",
				value: title,
				parameterized: true,
			},
			{
				key: "privacy",
				value: privacy.toLowerCase(),
			},
			{
				key: "columnNames",
				value: join(COLUMN_NAMES.PLAYLIST),
			},
		],
	});

	const { playlistID } = playlist;

	await query(context.pg)(INSERT_LIBRARY_OBJECT)({
		variables: {
			inLibrary: true,
			objectID: playlistID,
			tableName: "library_playlists",
			columnName: COLUMN_NAMES.PLAYLIST[0],
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		},
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
