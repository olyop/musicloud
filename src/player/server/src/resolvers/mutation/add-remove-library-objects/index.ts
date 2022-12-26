import { ArtistID, PlaylistID, SongID } from "@oly_op/musicloud-common/build/types";

import { Artist, Playlist, Song } from "../../../types/index.js";
import {
	addArtistToLibraryHelper,
	addPlaylistToLibraryHelper,
	addSongToLibraryHelper,
	getPlaylist,
	removeArtistFromLibraryHelper,
	removePlaylistFromLibraryHelper,
	removeSongFromLibraryHelper,
} from "../../helpers/index.js";
import resolver from "../resolver.js";

export const addSongToLibrary = resolver<Song, SongID>(({ args, context }) =>
	addSongToLibraryHelper(context.pg)({
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	})({ songID: args.songID }),
);

export const removeSongFromLibrary = resolver<Song, SongID>(({ args, context }) =>
	removeSongFromLibraryHelper(context.pg)({
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	})({ songID: args.songID }),
);

export const addArtistToLibrary = resolver<Artist, ArtistID>(({ args, context }) =>
	addArtistToLibraryHelper(context.pg)({
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	})({ artistID: args.artistID }),
);

export const removeArtistFromLibrary = resolver<Artist, ArtistID>(({ args, context }) =>
	removeArtistFromLibraryHelper(context.pg)({
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	})({ artistID: args.artistID }),
);

export const addPlaylistToLibrary = resolver<Playlist, PlaylistID>(async ({ args, context }) => {
	const { playlistID } = args;

	const playlist = await getPlaylist(context.pg)({ playlistID });

	if (context.getAuthorizationJWTPayload(context.authorization).userID === playlist.userID) {
		throw new Error("Users own playlist is always followed");
	}

	return addPlaylistToLibraryHelper(context.pg)({
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	})({ playlistID });
});

export const removePlaylistFromLibrary = resolver<Playlist, PlaylistID>(
	async ({ args, context }) => {
		const { playlistID } = args;

		const playlist = await getPlaylist(context.pg)({ playlistID });

		if (context.getAuthorizationJWTPayload(context.authorization).userID === playlist.userID) {
			throw new Error("Users own playlist is always followed");
		}

		return removePlaylistFromLibraryHelper(context.pg)({
			userID: context.getAuthorizationJWTPayload(context.authorization).userID,
		})({ playlistID });
	},
);
