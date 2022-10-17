import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { join, query, exists, convertFirstRowToCamelCase } from "@oly_op/pg-helpers";
import { AlgoliaRecordPlaylist, InterfaceWithInput } from "@oly_op/musicloud-common/build/types";

import resolver from "./resolver";
import { Playlist } from "../../types";
import { isNotUsersPlaylist } from "../helpers";
import { UPDATE_PLAYLIST_TITLE } from "../../sql";

type Args = InterfaceWithInput<Pick<Playlist, "playlistID" | "title">>;

export const updatePlaylistTitle = resolver<Playlist, Args>(async ({ args, context }) => {
	const { title, playlistID } = args.input;
	const { userID } = context.getAuthorizationJWTPayload(context.authorization);

	const playlistExists = await exists(context.pg)({
		value: playlistID,
		table: "playlists",
		column: COLUMN_NAMES.PLAYLIST[0],
	});

	if (!playlistExists) {
		throw new Error("Playlist does not exist");
	}

	if (await isNotUsersPlaylist(context.pg)({ userID, playlistID })) {
		throw new Error("Unauthorized to delete playlist");
	}

	const algoliaRecordUpdate: Partial<AlgoliaRecordPlaylist> = {
		title,
		objectID: playlistID,
	};

	await context.ag.index.partialUpdateObject(algoliaRecordUpdate);

	return query(context.pg)(UPDATE_PLAYLIST_TITLE)({
		parse: convertFirstRowToCamelCase(),
		variables: [
			{
				key: "playlistID",
				value: playlistID,
			},
			{
				key: "title",
				value: title,
				parameterized: true,
			},
			{
				key: "columnNames",
				value: join(COLUMN_NAMES.PLAYLIST),
			},
		],
	});
});
