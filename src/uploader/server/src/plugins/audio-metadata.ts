import musicMetadata from "music-metadata"
import { FastifyPluginAsync } from "fastify"

import { BodyEntry } from "./types"

interface Route {
	Body: {
		audio: BodyEntry[],
	},
}

export const audioMetadata: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.get<Route>(
			"/api/audio-metadata",
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
	}