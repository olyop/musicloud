import { S3 } from "@aws-sdk/client-s3";
import { SearchClient, SearchIndex } from "algoliasearch";
import "fastify";

declare module "fastify" {
	interface FastifyInstance {
		s3: S3;
		ag: {
			index: SearchIndex;
			client: SearchClient;
		};
	}
}
