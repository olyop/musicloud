import { FastifyStaticOptions } from "@fastify/static"

export const createFastifyStaticOptions =
	(path: string): FastifyStaticOptions => ({
		root: path,
		index: false,
	})