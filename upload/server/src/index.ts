import {
	HELMET_OPTIONS,
	PG_POOL_OPTIONS,
} from "@oly_op/musicloud-common"

import fastify from "fastify"
import helmet from "fastify-helmet"
import postgres from "fastify-postgres"
import compress from "fastify-compress"
import serveStatic from "fastify-static"
import multiPart from "fastify-multipart"

import {
	serveClient,
	uploadGenre,
	uploadAlbum,
	uploadArtist,
	audioMetadata,
} from "./plugins"

import {
	MULTIPART_OPTIONS,
	SERVE_STATIC_OPTIONS,
	FASTIFY_SERVER_OPTIONS,
} from "./globals"

const start =
	async () => (
		fastify(FASTIFY_SERVER_OPTIONS)
			.register(helmet, HELMET_OPTIONS)
			.register(compress)
			.register(multiPart, MULTIPART_OPTIONS)
			.register(postgres, PG_POOL_OPTIONS)
			.register(serveStatic, SERVE_STATIC_OPTIONS)
			.register(audioMetadata)
			.register(uploadAlbum)
			.register(uploadGenre)
			.register(uploadArtist)
			.register(serveClient)
			.listen(
				parseInt(process.env.UPLOAD_SERVER_PORT),
				process.env.HOST,
			)
	)

void start()