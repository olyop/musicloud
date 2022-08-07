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
		fastify.put<Route>(
			"/audio-metadata",
			async request => {
				const audio =
					request.body.audio[0]!.data

				const metadata =
					await musicMetadata.parseBuffer(audio)

				const {
					disk,
					title,
					genre,
					track,
					album,
					artist,
				} = metadata.common

				return {
					title,
					album,
					artist,
					genres: genre![0],
					discNumber: disk.no || 1,
					trackNumber: track.no || 1,
				}
			},
		)
	}