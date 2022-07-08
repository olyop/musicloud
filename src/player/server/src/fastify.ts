import Fastify from "fastify"
import { readFile } from "node:fs/promises"
import { FASTIFY_SERVER_OPTIONS } from "@oly_op/musicloud-common"

const fastify =
	process.env.USE_HTTPS ?
		Fastify({
			...FASTIFY_SERVER_OPTIONS,
			https: {
				cert: await readFile(process.env.TLS_CERTIFICATE_PATH),
				key: await readFile(process.env.TLS_CERTIFICATE_KEY_PATH),
			},
		}) :
		Fastify(FASTIFY_SERVER_OPTIONS)

export default fastify