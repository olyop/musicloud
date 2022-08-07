import { FastifyPluginAsync } from "fastify"

import { checkCountryExists } from "./country-exists"
import { checkGenreNameExists } from "./genre-name-exists"
import { checkArtistNameExists } from "./artist-name-exists"

export const check: FastifyPluginAsync =
	async fastify => {
		await fastify.register(checkCountryExists)
		await fastify.register(checkGenreNameExists)
		await fastify.register(checkArtistNameExists)
	}