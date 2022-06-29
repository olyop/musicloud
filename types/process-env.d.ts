type TrueFalse =
	"true" | "false"

type NodeENV =
	"development" | "production"

declare namespace NodeJS {
	interface ProcessEnv {
		HOST: string,
		PORT: string,
		NODE_ENV: NodeENV,
		AWS_REGION: string,
		JWT_ALGORITHM: "ES512",
		JWT_TOKEN_SECRET: string,
		AWS_ACCESS_KEY_ID: string,
		SERVICE_WORKER: TrueFalse,
		ANALYZE_BUNDLE: TrueFalse,
		PLAYER_SERVER_PORT: string,
		PLAYER_CLIENT_PORT: string,
		UPLOAD_SERVER_PORT: string,
		UPLOAD_CLIENT_PORT: string,
		ALGOLIA_INDEX_NAME: string,
		POSTGRESQL_USERNAME: string,
		POSTGRESQL_DATABASE: string,
		POSTGRESQL_PASSWORD: string,
		POSTGRESQL_HOSTNAME: string,
		LINTING_IN_BUILD: TrueFalse,
		AWS_SECRET_ACCESS_KEY: string,
		ALGOLIA_ADMIN_API_KEY: string,
		ALGOLIA_SEARCH_API_KEY: string,
		ALGOLIA_APPLICATION_ID: string,
	}
}