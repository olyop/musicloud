import { FastifyPluginAsync } from "fastify"

import { uploadAlbum } from "./album"
import { uploadGenre } from "./genre"
import { uploadArtist } from "./artist"

export const upload: FastifyPluginAsync =
	async fastify => {
		await fastify.register(uploadAlbum)
		await fastify.register(uploadGenre)
		await fastify.register(uploadArtist)
	}