type TrueFalse = "true" | "false";

type NodeENV = "development" | "production";

declare namespace NodeJS {
	// eslint-disable-next-line unicorn/prevent-abbreviations
	interface ProcessEnv {
		NODE_ENV: NodeENV;
		HTTPS: TrueFalse;
		TESTING: TrueFalse;
		HOST: string;

		PLAYER_SERVER_PORT: string;
		PLAYER_CLIENT_PORT: string;
		ACCOUNTS_SERVER_PORT: string;
		ACCOUNTS_CLIENT_PORT: string;
		UPLOADER_SERVER_PORT: string;
		UPLOADER_CLIENT_PORT: string;
		AUTHENTICATOR_SERVER_PORT: string;
		AUTHENTICATOR_CLIENT_PORT: string;

		TLS_CERTIFICATE_PATH: string;
		TLS_CERTIFICATE_KEY_PATH: string;

		SERVICE_WORKER: TrueFalse;
		ANALYZE_BUNDLE: TrueFalse;
		LINTING_IN_BUILD: TrueFalse;

		AWS_S3_BUCKET_NAME: string;
		AWS_S3_BUCKET_URL: string;
		AWS_CLOUDFRONT_URL: string;

		AWS_REGION: string;
		AWS_ACCESS_KEY_ID: string;
		AWS_ACCESS_KEY_SECRET: string;

		POSTGRESQL_HOSTNAME: string;
		POSTGRESQL_PORT: string;
		POSTGRESQL_USERNAME: string;
		POSTGRESQL_PASSWORD: string;
		POSTGRESQL_DATABASE: string;

		REDIS_HOSTNAME: string;
		REDIS_PORT: string;
		REDIS_USERNAME: string;
		REDIS_PASSWORD: string;
		REDIS_KEY_PREFIX: string;

		ALGOLIA_SEARCH_INDEX_NAME: string;
		ALGOLIA_APPLICATION_ID: string;
		ALGOLIA_ADMIN_API_KEY: string;
		ALGOLIA_SEARCH_API_KEY: string;

		JWT_TOKEN_SECRET: string;

		ADMIN_USER_ID: string;

		TS_NODE_PROJECT?: string;
	}
}
