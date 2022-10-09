import type { FastifyCorsOptions } from "@fastify/cors";

import { determineServiceURL, ServiceOptions } from "./determine-service-url";

export const createFastifyCORSOptions = ({ service }: ServiceOptions): FastifyCorsOptions => ({
	origin: determineServiceURL({ service }),
});
