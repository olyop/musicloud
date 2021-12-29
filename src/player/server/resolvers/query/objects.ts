import {
	UserID,
	PlayID,
	SongID,
	AlbumID,
	GenreID,
	ArtistID,
	PlaylistID,
	PlaylistPrivacy,
} from "@oly_op/music-app-common/types"

import { ForbiddenError } from "apollo-server-fastify"

import {
	User,
	Song,
	Play,
	Album,
	Genre,
	Artist,
	Playlist,
} from "../../types"

import {
	getPlay,
	getSong,
	getAlbum,
	getGenre,
	getArtist,
	getPlaylist,
	getUser as getUserHelper,
} from "../helpers"

import resolver from "./resolver"

export const getQueue =
	resolver(() => ({}))

export const getLibrary =
	resolver(() => ({}))

export const getUser =
	resolver<User>(
		({ context }) => (
			getUserHelper(context.pg)({
				userID: context.authorization!.userID,
			})
		),
	)

export const getUserByID =
	resolver<User, UserID>(
		({ args, context }) => (
			getUserHelper(context.pg)(args)
		),
	)

export const getSongByID	=
	resolver<Song, SongID>(
		({ args, context }) => (
			getSong(context.pg)(args)
		),
	)

export const getPlayByID =
	resolver<Play, PlayID>(
		({ args, context }) => (
			getPlay(context.pg)(args)
		),
	)

export const getAlbumByID =
	resolver<Album, AlbumID>(
		({ args, context }) => (
			getAlbum(context.pg)(args)
		),
	)

export const getGenreByID =
	resolver<Genre, GenreID>(
		({ args, context }) => (
			getGenre(context.pg)(args)
		),
	)

export const getArtistByID =
	resolver<Artist, ArtistID>(
		({ args, context }) => (
			getArtist(context.pg)(args)
		),
	)

export const getPlaylistByID =
	resolver<Playlist, PlaylistID>(
		async ({ args, context }) => {
			const playlist =
				await getPlaylist(context.pg)(args)
			if (playlist.privacy === PlaylistPrivacy.PRIVATE) {
				if (playlist.userID === context.authorization!.userID) {
					return playlist
				} else {
					throw new ForbiddenError("Unauthorized access to this playlist")
				}
			} else {
				return playlist
			}
		},
	)