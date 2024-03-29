import { S3 } from "@aws-sdk/client-s3";
import postgres from "@fastify/postgres";
import {
	ALGOLIA_OPTIONS,
	AWS_S3_OPTIONS,
	PG_POOL_OPTIONS,
} from "@oly_op/musicloud-common/build/server-options";
import algoliasearch, { AlgoliaSearchOptions, SearchClient } from "algoliasearch";
import fp from "fastify-plugin";

const algolia = algoliasearch as unknown as (
	appId: string,
	apiKey: string,
	options?: AlgoliaSearchOptions,
) => SearchClient;

const s3 = new S3(AWS_S3_OPTIONS);

const agClient = algolia(...ALGOLIA_OPTIONS);

const agIndex = agClient.initIndex(process.env.ALGOLIA_SEARCH_INDEX_NAME);

const ag = {
	index: agIndex,
	client: agClient,
};

export const services = fp(async fastify => {
	fastify.decorate("s3", s3);
	fastify.decorate("ag", ag);
	await fastify.register(postgres, PG_POOL_OPTIONS);
});
