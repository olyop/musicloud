import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import { AlgoliaRecordPlaylist, InterfaceWithInput } from "@oly_op/musicloud-common/build/types";
import {
	addPrefix,
	convertFirstRowToCamelCase,
	exists,
	importSQL,
	query,
} from "@oly_op/pg-helpers";
import { Redis } from "ioredis";

import { Playlist } from "../../../types/index.js";
import {
	determineRedisPlaylistsKey,
	getCacheValue,
	isNotUsersPlaylist,
	setCacheValue,
} from "../../helpers/index.js";
import resolver from "../resolver.js";

const UPDATE_PLAYLIST_TITLE = await importSQL(import.meta.url)("update-playlist-title");

const updatePlaylistCache = (redis: Redis) => async (playlistID: string, title: string) => {
	const cacheKey = determineRedisPlaylistsKey(playlistID, "row");

	const cachedPlaylist = await getCacheValue(redis)<Playlist>(cacheKey);

	if (cachedPlaylist) {
		await setCacheValue(redis)<Playlist>(cacheKey, {
			...cachedPlaylist,
			title,
		});
	}
};

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

	const playlist = await query(context.pg)(UPDATE_PLAYLIST_TITLE)({
		parse: convertFirstRowToCamelCase<Playlist>(),
		variables: {
			playlistID,
			title: [title, [true]],
			columnNames: addPrefix(COLUMN_NAMES.PLAYLIST),
		},
	});

	const algoliaRecordUpdate: Partial<AlgoliaRecordPlaylist> = {
		title,
		objectID: playlistID,
	};

	await context.ag.index.partialUpdateObject(algoliaRecordUpdate);

	await updatePlaylistCache(context.redis)(playlistID, title);

	return playlist;
});
