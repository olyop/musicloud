import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { AlgoliaRecordPlaylist, InterfaceWithInput } from "@oly_op/musicloud-common/build/types";
import {
	addPrefix,
	convertFirstRowToCamelCase,
	exists,
	importSQL,
	query,
} from "@oly_op/pg-helpers";

import { Playlist } from "../../../types";
import { isNotUsersPlaylist } from "../../helpers";
import resolver from "../resolver";

const UPDATE_PLAYLIST_TITLE = await importSQL(import.meta.url)("update-playlist-title");

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
		variables: {
			playlistID,
			title: [title, [true]],
			columnNames: addPrefix(COLUMN_NAMES.PLAYLIST),
		},
	});
});
