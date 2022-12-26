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

import { Album, Artist, Genre, Play, Playlist, Song, User } from "../../types/index.js";
import {
	determineRedisAlbumsKey,
	determineRedisArtistsKey,
	determineRedisGenresKey,
	determineRedisPlaysKey,
	determineRedisSongsKey,
	determineRedisUsersKey,
	getAlbum,
	getArtist,
	getGenre,
	getPlay,
	getPlaylist,
	getSong,
	getUser as getUserHelper,
	redisHandler,
} from "../helpers/index.js";
import resolver from "./resolver.js";

export const getQueue = resolver(() => Promise.resolve({}));

export const getLibrary = resolver(() => Promise.resolve({}));

export const getUser = resolver(({ context }) =>
	redisHandler(context.redis)(
		determineRedisUsersKey(context.getAuthorizationJWTPayload(context.authorization).userID, "row"),
		() =>
			getUserHelper(context.pg)({
				userID: context.getAuthorizationJWTPayload(context.authorization).userID,
			}),
	),
);

export const getUserByID = resolver<User, UserID>(({ args, context }) =>
	redisHandler(context.redis)(determineRedisUsersKey(args.userID, "row"), () =>
		getUserHelper(context.pg)({
			userID: args.userID,
		}),
	),
);

export const getSongByID = resolver<Song, SongID>(({ args, context }) =>
	redisHandler(context.redis)(determineRedisSongsKey(args.songID, "row"), () =>
		getSong(context.pg)({
			songID: args.songID,
		}),
	),
);

export const getPlayByID = resolver<Play, PlayID>(({ args, context }) =>
	redisHandler(context.redis)(determineRedisPlaysKey(args.playID, "row"), () =>
		getPlay(context.pg)({
			playID: args.playID,
		}),
	),
);

export const getAlbumByID = resolver<Album, AlbumID>(({ args, context }) =>
	redisHandler(context.redis)(determineRedisAlbumsKey(args.albumID, "row"), () =>
		getAlbum(context.pg)({
			albumID: args.albumID,
		}),
	),
);

export const getGenreByID = resolver<Genre, GenreID>(({ args, context }) =>
	redisHandler(context.redis)(determineRedisGenresKey(args.genreID, "row"), () =>
		getGenre(context.pg)({
			genreID: args.genreID,
		}),
	),
);

export const getArtistByID = resolver<Artist, ArtistID>(({ args, context }) =>
	redisHandler(context.redis)(determineRedisArtistsKey(args.artistID, "row"), () =>
		getArtist(context.pg)({
			artistID: args.artistID,
		}),
	),
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
