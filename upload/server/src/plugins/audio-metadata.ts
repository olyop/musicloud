import { FastifyPluginCallback } from "fastify"
import { parseBuffer } from "music-metadata/lib/core"

import { BodyEntry } from "./types"

interface Route {
	Body: {
		audio: BodyEntry[],
	},
}

export const audioMetadata: FastifyPluginCallback =
	(fastify, _, done) => {
		fastify.put<Route>(
			"/audio-metadata",
			async (request, reply) => {
				const audio = request.body.audio[0]!.data

				const metadata =
					await parseBuffer(audio)

				const { title } = metadata.common

				return reply.send({
					title,
				})
			},
		)
		done()
	}