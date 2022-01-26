import {
	CORS_OPTIONS,
	HELMET_OPTIONS,
	PG_POOL_OPTIONS,
} from "@oly_op/music-app-common/options"

import fastify from "fastify"
import cors from "fastify-cors"
import helmet from "fastify-helmet"
import postgres from "fastify-postgres"
import compress from "fastify-compress"
import serveStatic from "fastify-static"
import multiPart from "fastify-multipart"
import listenCallback from "@oly_op/music-app-common/fastify-listen-callback"

import {
	uploadUser,
	serveClient,
	uploadGenre,
	uploadAlbum,
	uploadArtist,
} from "./plugins"

import {
	MULTIPART_OPTIONS,
	SERVE_STATIC_OPTIONS,
	FASTIFY_SERVER_OPTIONS,
} from "./globals"

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
			.listen(
				parseInt(process.env.UPLOAD_SERVER_PORT),
				process.env.HOST,
				listenCallback,
			)
	)

start()