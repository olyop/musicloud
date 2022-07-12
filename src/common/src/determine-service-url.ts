import { AccessToken } from "./types"
import { DOMAIN_NAME } from "./metadata"

const IS_TESTING =
	process.env.TESTING === "true"

const USE_HTTPS =
	process.env.USE_HTTPS === "true"

const IS_DEVELOPMENT =
	process.env.NODE_ENV === "development"

const determineDevelopmentPort =
	({ service }: ServiceOptions) => {
		if (service === "player") {
			return process.env.PLAYER_CLIENT_PORT
		} else if (service === "uploader") {
			return process.env.UPLOADER_CLIENT_PORT
		} else if (service === "authenticator") {
			return process.env.AUTHENTICATOR_CLIENT_PORT
		} else {
			throw new Error("Invalid service name")
		}
	}

const determineTestingPort =
	({ service }: ServiceOptions) => {
		if (service === "player") {
			return process.env.PLAYER_SERVER_PORT
		} else if (service === "uploader") {
			return process.env.UPLOADER_SERVER_PORT
		} else if (service === "authenticator") {
			return process.env.AUTHENTICATOR_SERVER_PORT
		} else {
			throw new Error("Invalid service name")
		}
	}

export const determineServiceURL =
	({ accessToken, service }: DetermineServiceURLOptions) => {
		const protocol =
			IS_DEVELOPMENT ?
				(USE_HTTPS ? "https" : "http") :
				"https"

		const domain =
			IS_DEVELOPMENT ?
				process.env.HOST :
				(IS_TESTING ? process.env.HOST : DOMAIN_NAME)

		if (IS_DEVELOPMENT || IS_TESTING) {
			const port =
				IS_DEVELOPMENT ?
					determineDevelopmentPort({ service }) :
					determineTestingPort({ service })

			if (accessToken) {
				return `${protocol}://${domain}:${port}?accessToken=${accessToken}`
			} else {
				return `${protocol}://${domain}:${port}`
			}
		} else {
			if (accessToken) {
				return `${protocol}://${service}.${domain}?accessToken=${accessToken}`
			} else {
				return `${protocol}://${service}.${domain}`
			}
		}
	}

export type ServicesNames =
	"player" | "uploader" | "authenticator"

export interface ServiceOptions {
	service: ServicesNames,
}

export interface DetermineServiceURLOptions
	extends Partial<AccessToken>, ServiceOptions {}