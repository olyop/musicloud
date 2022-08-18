import { trim } from "lodash-es"
import { readFile } from "node:fs/promises"
import { FastifyPluginAsync } from "fastify"
import { GenreBase, GenreID } from "@oly_op/musicloud-common/build/types"
import { query, exists, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"

import { addRecordToSearchIndex } from "../helpers"

interface Route {
	Body: Pick<GenreBase, "name">,
}

const INSERT_GENRE =
	(await readFile(new URL("./insert.sql", import.meta.url))).toString()

export const uploadGenre: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.post<Route>(
			"/genre",
			{ onRequest: fastify.authenticate },
			async (request, reply) => {
				const name = trim(request.body.name)

				const doesGenreAlreadyExist =
					await exists(fastify.pg.pool)({
						value: name,
						column: "name",
						table: "genres",
					})

				if (doesGenreAlreadyExist) {
					throw new Error("Genre already exists")
				}

				const { genreID } =
					await query(fastify.pg.pool)(INSERT_GENRE)({
						parse: convertFirstRowToCamelCase<GenreID>(),
						variables: [{
							key: "name",
							value: name,
							parameterized: true,
						}],
					})

				await addRecordToSearchIndex(fastify.ag.index)({
					name,
					plays: 0,
					typeName: "Genre",
					objectID: genreID,
				})

				await reply.code(201)

				return {
					genreID,
				}
			},
		)
	}