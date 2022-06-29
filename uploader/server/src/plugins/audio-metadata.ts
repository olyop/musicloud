import musicMetadata from "music-metadata"
import { FastifyPluginCallback } from "fastify"

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
				const audio =
					request.body.audio[0]!.data

				const metadata =
					await musicMetadata.parseBuffer(audio)

				const {
					title,
					genre,
					disk,
					track,
				} = metadata.common

				const genres =
					genre![0]

				return reply.send({
					title,
					genres,
					discNumber: disk.no || 1,
					trackNumber: track.no || 1,
				})
			},
		)
		done()
	}