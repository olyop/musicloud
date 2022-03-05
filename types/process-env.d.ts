type ProcessEnvTrueFalse =
	"true" | "false"

type ProcessEnvNodeENV =
	"development" | "production"

declare namespace NodeJS {
	interface ProcessEnv {
		HOST: string,
		PORT: string,
		AWS_REGION: string,
		AWS_RDS_USERNAME: string,
		AWS_RDS_DATABASE: string,
		AWS_RDS_PASSWORD: string,
		AWS_RDS_ENDPOINT: string,
		JWT_TOKEN_SECRET: string,
		AWS_ACCESS_KEY_ID: string,
		PLAYER_SERVER_PORT: string,
		PLAYER_CLIENT_PORT: string,
		UPLOAD_SERVER_PORT: string,
		UPLOAD_CLIENT_PORT: string,
		ALGOLIA_INDEX_NAME: string,
		NODE_ENV: ProcessEnvNodeENV,
		AWS_SECRET_ACCESS_KEY: string,
		ALGOLIA_ADMIN_API_KEY: string,
		ALGOLIA_SEARCH_API_KEY: string,
		ALGOLIA_APPLICATION_ID: string,
		SOURCE_MAPS: ProcessEnvTrueFalse,
		ANALYZE_BUNDLE: ProcessEnvTrueFalse,
	}
}