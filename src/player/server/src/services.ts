import { ApolloServer } from "@apollo/server";
import { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import { S3Client } from "@aws-sdk/client-s3";
import { createFastify } from "@oly_op/musicloud-common/build/create-fastify";
import { IS_DEVELOPMENT } from "@oly_op/musicloud-common/build/globals";
import { ALGOLIA_OPTIONS, AWS_S3_OPTIONS } from "@oly_op/musicloud-common/build/server-options";
import algoliasearch, { AlgoliaSearchOptions, SearchClient } from "algoliasearch";
import { Redis } from "ioredis";

import { Context } from "./context/index.js";
import resolvers from "./resolvers/index.js";
import typeDefs from "./type-defs/index.js";

export const fastify = await createFastify();

export const apollo = new ApolloServer<Context>({
	typeDefs,
	resolvers,
	plugins: [fastifyApolloDrainPlugin(fastify)],
});

export const redis = new Redis({
	host: process.env.REDIS_HOSTNAME,
	port: Number.parseInt(process.env.REDIS_PORT),
	password: IS_DEVELOPMENT ? undefined : process.env.REDIS_PASSWORD,
});

export const s3 = new S3Client(AWS_S3_OPTIONS);

const algolia = algoliasearch as unknown as (
	appId: string,
	apiKey: string,
	options?: AlgoliaSearchOptions,
) => SearchClient;

export const agClient = algolia(...ALGOLIA_OPTIONS);
export const agIndex = agClient.initIndex(process.env.ALGOLIA_SEARCH_INDEX_NAME);
