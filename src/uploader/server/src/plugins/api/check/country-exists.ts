import includes from "lodash-es/includes";
import { FastifyPluginAsync } from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import { NameBase } from "@oly_op/musicloud-common/build/types";

import countries from "./countries";

interface Route extends RouteGenericInterface {
	Querystring: NameBase;
}

const countriesNames = Object.values(countries);

export const checkCountryExists: FastifyPluginAsync =
	// eslint-disable-next-line @typescript-eslint/require-await
	async fastify => {
		fastify.get<Route>("/country-exists", { onRequest: fastify.authenticate }, request => ({
			exists: includes(countriesNames, request.query.name),
		}));
	};
