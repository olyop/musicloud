import "fastify"

declare module "fastify" {
	interface FastifyRequest {
		isMultipart?: boolean,
	}
}