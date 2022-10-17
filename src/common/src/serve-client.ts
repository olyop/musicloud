import { FastifyPluginAsync } from "fastify";
import { existsSync, createReadStream } from "node:fs";

export const serveClient: FastifyPluginAsync<Options> =
	// eslint-disable-next-line @typescript-eslint/require-await
	async (fastify, { indexPath }) => {
		const exists = existsSync(indexPath);

		fastify.setNotFoundHandler((request, reply) => {
			if (exists) {
				const stream = createReadStream(indexPath);
				void reply.type("text/html").send(stream);
			} else {
				void reply.status(404);
				void reply.send("Not found");
			}
		});
	};

interface Options {
	indexPath: string;
}
