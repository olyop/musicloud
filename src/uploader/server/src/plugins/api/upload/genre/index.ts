import { trim } from "lodash-es"
import { readFile } from "node:fs/promises"
import { FastifyPluginAsync } from "fastify"
import { GenreBase, GenreID } from "@oly_op/musicloud-common/build/types"
import { query, exists, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"

import { addRecordToSearchIndex, deleteRecordFromSearchIndex } from "../helpers"

interface Route {
	Body: Pick<GenreBase, "name">,
}

const INSERT_GENRE =
	(await readFile(new URL("./insert-genre.sql", import.meta.url))).toString()

export const uploadGenre: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.post<Route>(
			"/genre",
			{ onRequest: fastify.authenticate },
			async (request, reply) => {
				const { body } = request
				const name = trim(body.name)

				const doesGenreAlreadyExist =
					await exists(fastify.pg.pool)({
						value: name,
						column: "name",
						table: "genres",
					})

				if (doesGenreAlreadyExist) {
					throw new Error("Genre already exists")
				}

				console.log(`Start Genre Upload: ${name}`)

				let genreID: string | null = null
				const client = await fastify.pg.pool.connect()

				try {
					await client.query("BEGIN")

					const result =
						await query(client)(INSERT_GENRE)({
							parse: convertFirstRowToCamelCase<GenreID>(),
							variables: [{
								key: "name",
								value: name,
								parameterized: true,
							}],
						})

					genreID = result.genreID

					await addRecordToSearchIndex(fastify.ag.index)({
						name,
						plays: 0,
						typeName: "Genre",
						objectID: genreID,
					})

					await client.query("COMMIT")

					console.log(`Finish Genre Upload: ${name}`)

					void reply.code(201)

					return { genreID }
				} catch (error) {
					await client.query("ROLLBACK")

					if (genreID) {
						await deleteRecordFromSearchIndex(fastify.ag.index)({
							objectID: genreID,
						})
					}

					throw new Error(`Error uploading genre: ${(error as Error).message}`)
				}
			},
		)
	}