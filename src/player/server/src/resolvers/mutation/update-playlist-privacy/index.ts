import { COLUMN_NAMES } from "@oly_op/musicloud-common/build/tables-column-names";
import {
	AlgoliaRecordPlaylist,
	InterfaceWithInput,
	PlaylistID,
	PlaylistPrivacyBase,
} from "@oly_op/musicloud-common/build/types";
import {
	addPrefix,
	convertFirstRowToCamelCase,
	exists,
	importSQL,
	query,
} from "@oly_op/pg-helpers";
import { SearchIndex } from "algoliasearch";
import { Redis } from "ioredis";

import { Playlist } from "../../../types/index.js";
import {
	determineRedisPlaylistsKey,
	getCacheValue,
	isNotUsersPlaylist,
	setCacheValue,
} from "../../helpers/index.js";
import resolver from "../resolver.js";

const UPDATE_PLAYLIST_PRIVACY = await importSQL(import.meta.url)("update-playlist-privacy");

interface UpdatePlaylistPrivacyOptions extends PlaylistID, PlaylistPrivacyBase {}

const updatePlaylistInAlgolia =
	(ag: SearchIndex) =>
	async ({ playlistID, privacy }: UpdatePlaylistPrivacyOptions) => {
		const algoliaRecordUpdate: Partial<AlgoliaRecordPlaylist> = {
			privacy,
			objectID: playlistID,
		};

		await ag.partialUpdateObject(algoliaRecordUpdate);
	};

const updatePlaylistCache =
	(redis: Redis) =>
	async ({ playlistID, privacy }: UpdatePlaylistPrivacyOptions) => {
		const cacheKey = determineRedisPlaylistsKey(playlistID, "row");
		const cachedPlaylist = await getCacheValue(redis)<Playlist>(cacheKey);

		if (cachedPlaylist) {
			await setCacheValue(redis)<Playlist>(cacheKey, {
				...cachedPlaylist,
				privacy,
			});
		}
	};

export const updatePlaylistPrivacy = resolver<Playlist, InterfaceWithInput<Input>>(
	async ({ args, context }) => {
		const { playlistID, privacy } = args.input;
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
			throw new Error("Unauthorized to update playlist");
		}

		const playlist = await query(context.pg)(UPDATE_PLAYLIST_PRIVACY)({
			parse: convertFirstRowToCamelCase<Playlist>(),
			variables: {
				privacy,
				playlistID,
				columnNames: addPrefix(COLUMN_NAMES.PLAYLIST, "playlists"),
			},
		});

		await updatePlaylistInAlgolia(context.ag.index)({ playlistID, privacy });
		await updatePlaylistCache(context.redis)({ playlistID, privacy });

		return playlist;
	},
);

type Input = Pick<Playlist, "playlistID" | "privacy">;
