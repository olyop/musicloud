import { PlaylistID } from "@oly_op/musicloud-common/build/types";
import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { query as pgHelpersQuery, exists as pgHelpersExists } from "@oly_op/pg-helpers";

import resolver from "./resolver";
import { isNotUsersPlaylist } from "../helpers";
import { DELETE_PLAYLIST_BY_ID } from "../../sql";

export const deletePlaylistByID =
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	resolver<void, PlaylistID>(async ({ args, context }) => {
		const { playlistID } = args;
		const { userID } = context.getAuthorizationJWTPayload(context.authorization);

		const query = pgHelpersQuery(context.pg);
		const exists = pgHelpersExists(context.pg);

		const playlistExists = await exists({
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

		await query(DELETE_PLAYLIST_BY_ID)({
			variables: { playlistID },
		});

		await context.ag.index.deleteObject(playlistID);
	});
