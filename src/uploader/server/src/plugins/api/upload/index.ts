import { FastifyPluginAsync } from "fastify";

import { uploadAlbum } from "./album/index.js";
import { uploadArtist } from "./artist/index.js";
import { uploadGenre } from "./genre/index.js";

export const upload: FastifyPluginAsync = async fastify => {
	await fastify.register(uploadAlbum);
	await fastify.register(uploadGenre);
	await fastify.register(uploadArtist);
};
