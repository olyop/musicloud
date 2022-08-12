import { trim } from "lodash-es"
import musicMetadata from "music-metadata"
import { FastifyPluginAsync } from "fastify"

import { BodyEntry } from "./types"

interface Route {
	Body: {
		audio: BodyEntry[],
	},
}

const toList =
	(value: string) =>
		value.split(/(,|&)/)
				 .map(trim)
				 .filter((x, index) => index % 2 === 0)

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
					title: title || null,
					album: album || null,
					discNumber: disk.no || 1,
					trackNumber: track.no || 1,
					artists: artist ? toList(artist) : null,
					genres: genre ? toList(genre[0]!) : null,
					mix: title ? (title.includes("Extended") ? "Extended" : null) : null,
				}
			},
		)
	}