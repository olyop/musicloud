import type { FastifyCorsOptions } from "@fastify/cors"

import { IS_DEVELOPMENT } from "./globals"
import { determinePort, determineServiceURL, ServiceOptions } from "./determine-service-url"

export const createFastifyCORSOptions =
	({ service }: ServiceOptions): FastifyCorsOptions => ({
		origin: (
			IS_DEVELOPMENT ? [
				determineServiceURL({ service }),
				"https://studio.apollographql.com",
			] : [
				determineServiceURL({ service }),
				`http://13.238.126.173:${determinePort({ service })}`,
			]
		),
	})