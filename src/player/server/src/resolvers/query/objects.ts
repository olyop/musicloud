import {
	AlbumID,
	ArtistID,
	GenreID,
	PlayID,
	PlaylistID,
	PlaylistPrivacy,
	SongID,
	UserID,
} from "@oly_op/musicloud-common/build/types";

import { Album, Artist, Genre, Play, Playlist, Song, User } from "../../types";
import {
	getAlbum,
	getArtist,
	getGenre,
	getPlay,
	getPlaylist,
	getSong,
	getUser as getUserHelper,
} from "../helpers";
import resolver from "./resolver";

export const getQueue = resolver(() => Promise.resolve({}));

export const getLibrary = resolver(() => Promise.resolve({}));

export const getUser = resolver(({ context }) =>
	getUserHelper(context.pg)({
		userID: context.getAuthorizationJWTPayload(context.authorization).userID,
	}),
);

export const getUserByID = resolver<User, UserID>(({ args, context }) =>
	getUserHelper(context.pg)({
		userID: args.userID,
	}),
);

export const getSongByID = resolver<Song, SongID>(({ args, context }) =>
	getSong(context.pg)({
		songID: args.songID,
	}),
);

export const getPlayByID = resolver<Play, PlayID>(({ args, context }) =>
	getPlay(context.pg)({
		playID: args.playID,
	}),
);

export const getAlbumByID = resolver<Album, AlbumID>(({ args, context }) =>
	getAlbum(context.pg)({
		albumID: args.albumID,
	}),
);

export const getGenreByID = resolver<Genre, GenreID>(({ args, context }) =>
	getGenre(context.pg)({
		genreID: args.genreID,
	}),
);

export const getArtistByID = resolver<Artist, ArtistID>(({ args, context }) =>
	getArtist(context.pg)({
		artistID: args.artistID,
	}),
);

export const getPlaylistByID = resolver<Playlist, PlaylistID>(async ({ args, context }) => {
	const playlist = await getPlaylist(context.pg)({
		playlistID: args.playlistID,
	});

	if (playlist.privacy === PlaylistPrivacy.PRIVATE) {
		if (playlist.userID === context.getAuthorizationJWTPayload(context.authorization).userID) {
			return playlist;
		} else {
			throw new Error("Unauthorized access to this playlist");
		}
	} else {
		return playlist;
	}
});
