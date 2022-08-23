import type { FastifyCorsOptions } from "@fastify/cors"

import { determineServiceURL, ServiceOptions } from "./determine-service-url"
import { IS_DEVELOPMENT } from "./globals"

const APOLLO_SANDBOX_ORIGIN = "https://studio.apollographql.com"

export const createFastifyCORSOptions =
	({ service }: ServiceOptions): FastifyCorsOptions => ({
		origin: IS_DEVELOPMENT ?
			[determineServiceURL({ service }), APOLLO_SANDBOX_ORIGIN] :
			determineServiceURL({ service }),
	})