import {
	join,
	query as pgQuery,
	convertTableToCamelCase,
} from "@oly_op/pg-helpers"

import pipe from "@oly_op/pipe"
import { ArtistIDBase } from "@oly_op/music-app-common/types"

import {
	shuffle,
	clearQueues,
	createResolver,
	getUserWithQueues,
	updateUserNowPlaying,
} from "../helpers"

import { User, Song } from "../../types"
import { COLUMN_NAMES } from "../../globals"
import { INSERT_QUEUE_SONG, SELECT_ARTIST_SONGS } from "../../sql"

const resolver =
	createResolver()

export const shuffleArtist =
	resolver<User, ArtistIDBase>(
		async ({ args, context }) => {
			let user: User
			const { userID } = context.authorization!
			const client = await context.pg.connect()
			const query = pgQuery(client)
			try {
				await query("BEGIN")()

				await clearQueues(client)(userID)

				const [ nowPlaying, ...shuffled ] =
					await query(SELECT_ARTIST_SONGS)({
						parse: pipe(
							convertTableToCamelCase<Song>(),
							shuffle(),
						),
						variables: {
							artistID: args.artistID,
							orderByDirection: "ASC",
							orderByField: "songs.title",
							columnNames: join(COLUMN_NAMES.SONG, "songs"),
						},
					})

				await updateUserNowPlaying(client)(userID, nowPlaying.songID)

				await Promise.all(shuffled.map(
					({ songID }, index) => (
						query(INSERT_QUEUE_SONG)({
							variables: {
								index,
								songID,
								userID,
								tableName: "queue_laters",
							},
						})
					),
				))

				user = await getUserWithQueues(client)(userID)

				await query("COMMIT")()
			} catch (error) {
				await query("ROLLBACK")()
				throw error
			} finally {
				client.release()
			}

			return user
		},
	)