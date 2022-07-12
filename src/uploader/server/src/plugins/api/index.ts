import multiPart from "@fastify/multipart"
import { FastifyPluginAsync } from "fastify"

import { upload } from "./upload"
import { audioMetadata } from "./audio-metadata"
import { MULTIPART_OPTIONS } from "../../globals"

export const api: FastifyPluginAsync =
	async fastify => {
		await fastify.register(multiPart, MULTIPART_OPTIONS)

		await fastify.register(
			async instance => {
				await instance.register(audioMetadata)
				await instance.register(upload, { prefix: "/upload" })
			},
			{
				prefix: "/api",
			},
		)
	}