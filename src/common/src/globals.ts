import type { Algorithm } from "fast-jwt";

export const IS_TESTING = process.env.TESTING === "true";

export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const USE_HTTPS = process.env.HTTPS === "true";

export const JWT_ALGORITHM: Algorithm = "HS512";

export const FILES_URL = IS_PRODUCTION
	? process.env.AWS_CLOUDFRONT_URL
	: process.env.AWS_S3_BUCKET_URL;

export const FILE_URL_PATH = "/catalog";

export const FILES_CATALOG_URL = `${FILES_URL}${FILE_URL_PATH}`;
