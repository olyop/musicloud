import {
	join,
	query as pgQuery,
	convertFirstRowToCamelCase,
} from "@oly_op/pg-helpers"

import { isEmpty, orderBy } from "lodash"
import { ApolloError } from "apollo-server-fastify"
import { ObjectIDBase } from "@oly_op/music-app-common/types"

import {
	Song,
	User,
	Genre,
	Album,
	Search,
	Artist,
	Playlist,
} from "../../types"

import {
	SELECT_USER_BY_ID,
	SELECT_SONG_BY_ID,
	SELECT_GENRE_BY_ID,
	SELECT_ALBUM_BY_ID,
	SELECT_ARTIST_BY_ID,
	SELECT_PLAYLIST_BY_ID,
} from "../../sql"

import { createResolver } from "../helpers"
import { COLUMN_NAMES } from "../../globals"

const resolver =
	createResolver()

interface Args {
	value: string,
	length: number,
}

interface Result extends ObjectIDBase {
	text: string,
	typeName: "User" | "Song" | "Genre" | "Album" | "Artist" | "Playlist",
}

export const search =
	resolver<Search[], Args>(
		async ({ args, context }) => {
			const { value, length } = args
			const query = pgQuery(context.pg)

			const { hits } =
				await context.ag.search<Result>(value, {
					page: 0,
					hitsPerPage: length,
					getRankingInfo: true,
					attributesToHighlight: [],
					attributesToRetrieve: ["*", "-image"],
				})

			const hitsRanked =
				orderBy(
					hits,
					["_rankingInfo.firstMatchedWord", "_rankingInfo.userScore"],
					["asc", "desc"],
				)

			const results =
				await Promise.all<Search>(
					hitsRanked.map(
						({ objectID, typeName }) => {
							if (typeName === "User") {
								return query(SELECT_USER_BY_ID)({
									parse: convertFirstRowToCamelCase<User>(),
									variables: {
										userID: objectID,
										columnNames: join(COLUMN_NAMES.USER),
									},
								})
							} else if (typeName === "Song") {
								return query(SELECT_SONG_BY_ID)({
									parse: convertFirstRowToCamelCase<Song>(),
									variables: {
										songID: objectID,
										columnNames: join(COLUMN_NAMES.SONG),
									},
								})
							} else if (typeName === "Genre") {
								return query(SELECT_GENRE_BY_ID)({
									parse: convertFirstRowToCamelCase<Genre>(),
									variables: {
										genreID: objectID,
										columnNames: join(COLUMN_NAMES.GENRE),
									},
								})
							} else if (typeName === "Album") {
								return query(SELECT_ALBUM_BY_ID)({
									parse: convertFirstRowToCamelCase<Album>(),
									variables: {
										albumID: objectID,
										columnNames: join(COLUMN_NAMES.ALBUM),
									},
								})
							} else if (typeName === "Artist") {
								return query(SELECT_ARTIST_BY_ID)({
									parse: convertFirstRowToCamelCase<Artist>(),
									variables: {
										artistID: objectID,
										columnNames: join(COLUMN_NAMES.ARTIST),
									},
								})
							} else if (typeName === "Playlist") {
								return query(SELECT_PLAYLIST_BY_ID)({
									parse: convertFirstRowToCamelCase<Playlist>(),
									variables: {
										playlistID: objectID,
										columnNames: join(COLUMN_NAMES.PLAYLIST),
									},
								})
							} else {
								throw new ApolloError("Typename error.")
							}
						},
					),
				)

			const resultsFiltered =
				results.filter(result => !isEmpty(result))

			return resultsFiltered
		},
	)