import includes from "lodash-es/includes"
import { FastifyPluginAsync } from "fastify"
import { RouteGenericInterface } from "fastify/types/route"
import { NameBase } from "@oly_op/musicloud-common/build/types"

interface Route extends RouteGenericInterface {
	Querystring: NameBase,
}

const countriesResult =
	await fetch("http://country.io/names.json")

const countriesRecord =
	await countriesResult.json() as Record<string, string>

const countriesNames =
	Object.values(countriesRecord)

export const checkCountryExists: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.get<Route>(
			"/country-exists",
			{ onRequest: fastify.authenticate },
			request => ({
				exists: includes(countriesNames, request.query.name),
			}),
		)
	}