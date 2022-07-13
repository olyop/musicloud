import fp from "fastify-plugin"
import postgres from "@fastify/postgres"
import { ALGOLIA_OPTIONS, AWS_S3_OPTIONS, PG_POOL_OPTIONS } from "@oly_op/musicloud-common"

import algolia from "algoliasearch"
import { S3 } from "@aws-sdk/client-s3"

const s3 =
	new S3(AWS_S3_OPTIONS)

const agClient =
	algolia(...ALGOLIA_OPTIONS)

const agIndex =
	agClient.initIndex(process.env.ALGOLIA_SEARCH_INDEX_NAME)

const ag = {
	index: agIndex,
	client: agClient,
}

export const services =
	fp(async fastify => {
		fastify.decorate("s3", s3)
		fastify.decorate("ag", ag)
		await fastify.register(postgres, PG_POOL_OPTIONS)
	})