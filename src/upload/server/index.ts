import fastify from "fastify"
import cors from "fastify-cors"
import helmet from "fastify-helmet"
import postgres from "fastify-postgres"
import compress from "fastify-compress"
import serveStatic from "fastify-static"
import multiPart from "fastify-multipart"

import {
	uploadUser,
	serveClient,
	uploadGenre,
	uploadAlbum,
	uploadArtist,
} from "./plugins"

import {
	CORS_OPTIONS,
	HELMET_OPTIONS,
	PG_POOL_OPTIONS,
	MULTIPART_OPTIONS,
	SERVE_STATIC_OPTIONS,
	FASTIFY_SERVER_OPTIONS,
	FASTIFY_LISTEN_OPTIONS,
} from "./globals"

const listenCallback =
	(error: Error | null) => {
		if (error) {
			console.error(error)
		}
	}

const start =
	() => (
		fastify(FASTIFY_SERVER_OPTIONS)
			.register(helmet, HELMET_OPTIONS)
			.register(cors, CORS_OPTIONS)
			.register(compress)
			.register(multiPart, MULTIPART_OPTIONS)
			.register(postgres, PG_POOL_OPTIONS)
			.register(serveStatic, SERVE_STATIC_OPTIONS)
			.register(uploadUser)
			.register(uploadAlbum)
			.register(uploadGenre)
			.register(uploadArtist)
			.register(serveClient)
			.listen(FASTIFY_LISTEN_OPTIONS, listenCallback)
	)

start()