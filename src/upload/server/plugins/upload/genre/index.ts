import { join } from "path"
import { trim } from "lodash"
import { readFileSync } from "fs"
import { FastifyPluginCallback } from "fastify"
import { GenreBase, GenreID } from "@oly_op/music-app-common/types"
import { query, exists, convertFirstRowToCamelCase } from "@oly_op/pg-helpers"

import { addIndexToAlgolia } from "../helpers"
import { UPLOAD_PLUGINS_PATH } from "../../../globals"

interface Route {
	Body: Pick<GenreBase, "name">,
}

const INSERT_GENRE =
	readFileSync(join(UPLOAD_PLUGINS_PATH, "genre", "insert.sql")).toString()

export const uploadGenre: FastifyPluginCallback =
	(fastify, options, done) => {
		fastify.post<Route>(
			"/upload/genre",
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

				await addIndexToAlgolia({
					name,
					typeName: "Genre",
					objectID: genreID,
				})

				return reply.send()
			},
		)
		done()
	}