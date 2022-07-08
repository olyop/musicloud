import {
	HELMET_OPTIONS,
	PG_POOL_OPTIONS,
} from "@oly_op/musicloud-common"

import createFastify from "fastify"
import helmet from "@fastify/helmet"
import postgres from "@fastify/postgres"
import compress from "@fastify/compress"
import serveStatic from "@fastify/static"
import multiPart from "@fastify/multipart"

import {
	serveClient,
	uploadGenre,
	uploadAlbum,
	uploadArtist,
	audioMetadata,
} from "./plugins"

import { MULTIPART_OPTIONS, SERVE_STATIC_OPTIONS, FASTIFY_SERVER_OPTIONS } from "./globals"

const fastify =
	createFastify(FASTIFY_SERVER_OPTIONS)

await fastify.register(helmet, HELMET_OPTIONS)
await fastify.register(compress)
await fastify.register(multiPart, MULTIPART_OPTIONS)
await fastify.register(postgres, PG_POOL_OPTIONS)
await fastify.register(serveStatic, SERVE_STATIC_OPTIONS)
await fastify.register(audioMetadata)
await fastify.register(uploadAlbum)
await fastify.register(uploadGenre)
await fastify.register(uploadArtist)
await fastify.register(serveClient)

await fastify.listen({
	host: process.env.HOST,
	port: parseInt(process.env.UPLOADER_SERVER_PORT),
})