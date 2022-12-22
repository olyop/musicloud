import { FastifyPluginAsync } from "fastify";

import { uploadAlbum } from "./album";
import { uploadArtist } from "./artist";
import { uploadGenre } from "./genre";

export const upload: FastifyPluginAsync = async fastify => {
	await fastify.register(uploadAlbum);
	await fastify.register(uploadGenre);
	await fastify.register(uploadArtist);
};
