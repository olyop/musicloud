import type { FastifyCorsOptions } from "@fastify/cors";
import { FastifyStaticOptions } from "@fastify/static";

import { determineServiceURL, ServiceOptions } from "./determine-service-url";

export const createFastifyCORSOptions = ({ service }: ServiceOptions): FastifyCorsOptions => ({
	origin: determineServiceURL({ service }),
});

export const createFastifyStaticOptions = ({
	root,
}: Pick<FastifyStaticOptions, "root">): FastifyStaticOptions => ({
	root,
	index: false,
});
