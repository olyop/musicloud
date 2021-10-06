export const IS_DEV = process.env.NODE_ENV! === "development"

export const HOST = process.env.HOST!
export const PORT = parseInt(process.env.PLAYER_SERVER_PORT!)

export const AWS_RDS_USERNAME = process.env.AWS_RDS_USERNAME!
export const AWS_RDS_DATABASE = process.env.AWS_RDS_DATABASE!
export const AWS_RDS_PASSWORD = process.env.AWS_RDS_PASSWORD!
export const AWS_RDS_ENDPOINT = process.env.AWS_RDS_ENDPOINT!

export const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY!
export const ALGOLIA_APPLICATION_ID = process.env.ALGOLIA_APPLICATION_ID!

export const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET!