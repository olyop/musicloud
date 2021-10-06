import { query, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"

import { createResolver } from "./helpers"
import { Play, User, Song } from "../types"
import { SELECT_USER_BY_ID, SELECT_SONG_BY_ID } from "../sql"

const resolver =
	createResolver<Play>()

export const dateCreated =
	resolver(
		({ parent }) => parent.dateCreated * 1000,
	)

export const user =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_USER_BY_ID)({
				parse: convertFirstRowToCamelCase<User>(),
				variables: { userID: parent.userID },
			})
		),
	)

export const song =
	resolver(
		({ parent, context }) => (
			query(context.pg)(SELECT_SONG_BY_ID)({
				parse: convertFirstRowToCamelCase<Song>(),
				variables: { songID: parent.songID },
			})
		),
	)