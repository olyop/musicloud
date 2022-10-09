import { exists } from "@oly_op/pg-helpers";
import { FastifyPluginAsync } from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import { NameBase } from "@oly_op/musicloud-common/build/types";

interface Route extends RouteGenericInterface {
	Querystring: NameBase;
}

export const checkArtistNameExists: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.get<Route>(
			"/artist-name-exists",
			{ onRequest: fastify.authenticate },
			async request => ({
				exists: await exists(fastify.pg.pool)({
					column: "name",
					table: "artists",
					value: request.query.name,
				}),
			}),
		);
	};
