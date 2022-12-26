import type { FastifyCorsOptions } from "@fastify/cors";
import { FastifyStaticOptions } from "@fastify/static";

import { ServiceOptions, determineServiceURL } from "./determine-service-url.js";

export const createFastifyCORSOptions = ({ service }: ServiceOptions): FastifyCorsOptions => ({
	origin: determineServiceURL({ service }),
});

export const createFastifyStaticOptions = ({
	root,
}: Pick<FastifyStaticOptions, "root">): FastifyStaticOptions => ({
	root,
	index: false,
});
