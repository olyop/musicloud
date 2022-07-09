import { AccessToken } from "./types"

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

export const determineServiceURL =
	({ accessToken, service }: DetermineServiceURLOptions) => {
		const protocol =
			IS_DEVELOPMENT ?
				(process.env.USE_HTTPS ? "https" : "http") :
				"https"

		const domain =
			IS_DEVELOPMENT ?
				process.env.HOST :
				"musicloud-app.com"

		if (IS_DEVELOPMENT) {
			const port = determineDevelopmentPort({ service })
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

interface ServiceOptions {
	service: ServicesNames,
}

export interface DetermineServiceURLOptions
	extends Partial<AccessToken>, ServiceOptions {}