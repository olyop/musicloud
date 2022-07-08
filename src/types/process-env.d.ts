type TrueFalse =
	"true" | "false"

type NodeENV =
	"development" | "production"

declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: NodeENV,

		HOST: string,

		PLAYER_SERVER_PORT: string,
		PLAYER_CLIENT_PORT: string,
		UPLOADER_SERVER_PORT: string,
		UPLOADER_CLIENT_PORT: string,
		AUTHENTICATOR_SERVER_PORT: string,
		AUTHENTICATOR_CLIENT_PORT: string,

		USE_HTTPS: TrueFalse,
		TLS_CERTIFICATE_PATH: string,
		TLS_CERTIFICATE_KEY_PATH: string,

		SERVICE_WORKER: TrueFalse,
		ANALYZE_BUNDLE: TrueFalse,
		LINTING_IN_BUILD: TrueFalse,

		AWS_REGION: string,
		AWS_ACCESS_KEY_ID: string,
		AWS_ACCESS_KEY_SECRET: string,

		POSTGRESQL_DATABASE: string,
		POSTGRESQL_USERNAME: string,
		POSTGRESQL_PASSWORD: string,
		POSTGRESQL_HOSTNAME: string,

		ALGOLIA_SEARCH_INDEX_NAME: string,
		ALGOLIA_APPLICATION_ID: string,
		ALGOLIA_ADMIN_API_KEY: string,
		ALGOLIA_SEARCH_API_KEY: string,

		JWT_ALGORITHM: "ES512",
		JWT_TOKEN_SECRET: string,
	}
}