export const FILES_URL =
	process.env.NODE_ENV === "development" ?
		"https://music-app.s3.ap-southeast-2.amazonaws.com" :
		"https://dt90vgr7xy6ia.cloudfront.net"

export const FILES_CATALOG_URL =
	`${FILES_URL}/catalog`