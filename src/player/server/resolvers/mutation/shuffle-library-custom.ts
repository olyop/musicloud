// import { query as pgHelpersQuery } from "@oly_op/pg-helpers"

// import resolver from "./resolver"
// import { clearQueue } from "../helpers"
// // import { SELECT_LIBRARY_SONGS } from "../../sql"

// interface Args {
// 	genres: string[] | null,
// 	artists: string[] | null,
// }

// export const shuffleLibraryCustom =
// 	resolver<Record<string, never>, Args>(
// 		async ({ args, context }) => {
// 			const { genres, artists } = args
// 			const { userID } = context.authorization!
// 			const client = await context.pg.connect()
// 			const query = pgHelpersQuery(client)

// 			try {
// 				await query("BEGIN")()

// 				await clearQueue(client)({ userID })

// 				// const librarySongs =
// 				// 	await query(SELECT_LIBRARY_SONGS)({
// 				// 		parse: convertTableToCamelCase<Song>(),
// 				// 		variables: {
// 				// 			userID,
// 				// 			columnNames: join(COLUMN_NAMES.SONG, "songs"),
// 				// 		},
// 				// 	})

// 				// if (!isEmpty(librarySongs)) {
// 				// 	const [ nowPlaying, ...shuffled ] =
// 				// 		librarySongs

// 				// 	await updateQueueNowPlaying(client, context.ag.index)({
// 				// 		userID,
// 				// 		value: nowPlaying!.songID,
// 				// 	})

// 				// 	await Promise.all(shuffled.map(
// 				// 		({ songID }, index) => (
// 				// 			query(INSERT_QUEUE_SONG)({
// 				// 				variables: {
// 				// 					index,
// 				// 					userID,
// 				// 					songID,
// 				// 					tableName: "queue_laters",
// 				// 				},
// 				// 			})
// 				// 		),
// 				// 	))
// 				// }

// 				await query("COMMIT")()
// 			} catch (error) {
// 				await query("ROLLBACK")()
// 				throw error
// 			} finally {
// 				client.release()
// 			}

// 			return {}
// 		},
// 	)