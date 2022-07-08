import { trim } from "lodash-es"
import { readFile } from "node:fs/promises"
import { FastifyPluginCallback } from "fastify"
import { GenreBase, GenreID } from "@oly_op/musicloud-common"
import { query, exists, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"

import { addRecordToSearchIndex } from "../helpers"

interface Route {
	Body: Pick<GenreBase, "name">,
}

const INSERT_GENRE =
	(await readFile(new URL("./insert.sql", import.meta.url))).toString()

export const uploadGenre: FastifyPluginCallback =
	(fastify, _, done) => {
		fastify.post<Route>(
			"/api/upload/genre",
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

				await addRecordToSearchIndex({
					name,
					plays: 0,
					typeName: "Genre",
					objectID: genreID,
				})

				return reply.send()
			},
		)
		done()
	}