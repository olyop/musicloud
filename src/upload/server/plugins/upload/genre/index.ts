import { join } from "path"
import { readFileSync } from "fs"
import { v4 as createUUID } from "uuid"
import { FastifyPluginCallback } from "fastify"
import { query, exists } from "@oly_op/pg-helpers"

import { addIndexToAlgolia } from "../helpers"
import { UPLOAD_PLUGINS_PATH } from "../../../globals"

interface Route {
	Body: {
		name: string,
	},
}

const INSERT_GENRE =
	readFileSync(join(UPLOAD_PLUGINS_PATH, "genre", "insert-genre.sql")).toString()

export const uploadGenre: FastifyPluginCallback =
	(fastify, options, done) => {
		fastify.post<Route>(
			"/upload/genre",
			async (request, reply) => {
				const genreID = createUUID()
				const { name } = request.body

				const doesGenreAlreadyExist =
					await exists(fastify.pg.pool)({
						value: name,
						column: "name",
						table: "genres",
					})

				if (doesGenreAlreadyExist) {
					throw new Error("Genre already exists")
				}

				await addIndexToAlgolia({
					text: name,
					typeName: "Genre",
					objectID: genreID,
				})

				await query(fastify.pg.pool)(INSERT_GENRE)({
					variables: [{
						key: "genreID",
						value: genreID,
					},{
						key: "name",
						value: name,
						parameterized: true,
					}],
				})

				return reply.send()
			},
		)
		done()
	}