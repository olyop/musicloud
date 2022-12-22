import { FastifyPluginAsync } from "fastify";

import { checkArtistNameExists } from "./artist-name-exists";
import { checkCountryExists } from "./country-exists";
import { checkGenreNameExists } from "./genre-name-exists";

export const check: FastifyPluginAsync = async fastify => {
	await fastify.register(checkCountryExists);
	await fastify.register(checkGenreNameExists);
	await fastify.register(checkArtistNameExists);
};
