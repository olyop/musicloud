import {
	UserIDBase,
	PlayIDBase,
	SongIDBase,
	AlbumIDBase,
	GenreIDBase,
	ArtistIDBase,
	PlaylistIDBase,
} from "@oly_op/music-app-common/types"

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
	resolver<Record<string, never>>(
		() => ({}),
	)

export const getLibrary =
	resolver<Record<string, never>>(
		() => ({}),
	)

export const getUser =
	resolver<User>(
		({ args, context }) => (
			getUserHelper(context.pg)({ userID: context.authorization!.userID })
		),
	)

export const getUserByID =
	resolver<User, UserIDBase>(
		({ args, context }) => (
			getUserHelper(context.pg)(args)
		),
	)

export const getSongByID	=
	resolver<Song, SongIDBase>(
		({ args, context }) => (
			getSong(context.pg)(args)
		),
	)

export const getPlayByID =
	resolver<Play, PlayIDBase>(
		({ args, context }) => (
			getPlay(context.pg)(args)
		),
	)

export const getAlbumByID =
	resolver<Album, AlbumIDBase>(
		({ args, context }) => (
			getAlbum(context.pg)(args)
		),
	)

export const getGenreByID =
	resolver<Genre, GenreIDBase>(
		({ args, context }) => (
			getGenre(context.pg)(args)
		),
	)

export const getArtistByID =
	resolver<Artist, ArtistIDBase>(
		({ args, context }) => getArtist(context.pg)(args),
	)

export const getPlaylistByID =
	resolver<Playlist, PlaylistIDBase>(
		({ args, context }) => (
			getPlaylist(context.pg)(args)
		),
	)