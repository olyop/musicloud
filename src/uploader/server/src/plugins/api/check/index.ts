import { FastifyPluginAsync } from "fastify";

import { checkArtistNameExists } from "./artist-name-exists.js";
import { checkCountryExists } from "./country-exists.js";
import { checkGenreNameExists } from "./genre-name-exists.js";

export const check: FastifyPluginAsync = async fastify => {
	await fastify.register(checkCountryExists);
	await fastify.register(checkGenreNameExists);
	await fastify.register(checkArtistNameExists);
};
