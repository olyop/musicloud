import Fastify from "fastify"
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import compress from "@fastify/compress"
import serveStatic from "@fastify/static"
import rateLimit from "@fastify/rate-limit"
import { readFile } from "node:fs/promises"
import { ServicesNames } from "@oly_op/musicloud-common/build/types"
import { FASTIFY_HELMET_OPTIONS } from "@oly_op/musicloud-common/build/server-options"
import { createFastifyCORSOptions } from "@oly_op/musicloud-common/build/create-fastify-cors-options"
import { createFastifyServerOptions } from "@oly_op/musicloud-common/build/create-fastify-server-options"

import { api, serveClient, services } from "./plugins"
import { FASTIFY_LISTEN_OPTIONS, FASTIFY_STATIC_OPTIONS } from "./globals"

const fastify =
	Fastify(createFastifyServerOptions({
		cert: await readFile(process.env.TLS_CERTIFICATE_PATH),
		key: await readFile(process.env.TLS_CERTIFICATE_KEY_PATH),
	}))

await fastify.register(rateLimit)
await fastify.register(helmet, FASTIFY_HELMET_OPTIONS)
await fastify.register(cors, createFastifyCORSOptions({ service: ServicesNames.AUTHENTICATOR }))
await fastify.register(compress)
await fastify.register(services)
await fastify.register(serveStatic, FASTIFY_STATIC_OPTIONS)
await fastify.register(api)
await fastify.register(serveClient)

await fastify.listen(FASTIFY_LISTEN_OPTIONS)