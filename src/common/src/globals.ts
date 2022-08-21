export const IS_TESTING =
	process.env.TESTING

export const IS_DEVELOPMENT =
	process.env.NODE_ENV === "development"

export const IS_PRODUCTION =
	process.env.NODE_ENV === "production"

export const USE_HTTPS =
	process.env.HTTPS === "true"

export const JWT_ALGORITHM =
	"HS512"

export const FILES_URL =
	IS_PRODUCTION ?
		"https://dt90vgr7xy6ia.cloudfront.net" :
		"https://music-app.s3.ap-southeast-2.amazonaws.com"

export const FILES_CATALOG_URL =
	`${FILES_URL}/catalog`