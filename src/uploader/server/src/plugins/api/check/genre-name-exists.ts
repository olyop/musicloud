import { exists } from "@oly_op/pg-helpers"
import { FastifyPluginAsync } from "fastify"
import { RouteGenericInterface } from "fastify/types/route"
import { NameBase } from "@oly_op/musicloud-common/build/types"

interface Route extends RouteGenericInterface {
	Querystring: NameBase,
}

export const checkGenreNameExists: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.get<Route>(
			"/genre-name-exists",
			async request => ({
				exists: await exists(fastify.pg.pool)({
					column: "name",
					table: "genres",
					value: request.query.name,
				}),
			}),
		)
	}