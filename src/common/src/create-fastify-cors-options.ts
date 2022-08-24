import type { FastifyCorsOptions } from "@fastify/cors"

import { IS_DEVELOPMENT } from "./globals"
import { determineServiceURL, ServiceOptions } from "./determine-service-url"

export const createFastifyCORSOptions =
	({ service }: ServiceOptions): FastifyCorsOptions => ({
		origin: (
			IS_DEVELOPMENT ?
				[determineServiceURL({ service }), "https://studio.apollographql.com"] :
				determineServiceURL({ service })
		),
	})