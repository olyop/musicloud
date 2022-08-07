import { DOMAIN_NAME } from "./metadata"
import { AccessToken, ServicesNames } from "./types"
import { IS_DEVELOPMENT, IS_TESTING, USE_HTTPS } from "./globals"

const DOMAIN =
	IS_DEVELOPMENT || IS_TESTING ?
		process.env.HOST : DOMAIN_NAME

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

const determinePort =
	({ service }: ServiceOptions) => (
		IS_DEVELOPMENT ?
			determineDevelopmentPort({ service }) :
			determineTestingPort({ service })
	)

export const determineServiceURL =
	({ service, redirect, accessToken }: DetermineServiceURLOptions) => {
		let url: URL

		const protocol =
			IS_DEVELOPMENT ?
				(USE_HTTPS ? "https" : "http") :
				"https"

		if (IS_DEVELOPMENT || IS_TESTING) {
			url = new URL(`${protocol}://${DOMAIN}:${determinePort({ service })}`)
		} else {
			url = new URL(`${protocol}://${service}.${DOMAIN}`)
		}

		if (accessToken) {
			url.searchParams.append("accessToken", accessToken)
		}

		if (redirect) {
			url.searchParams.append("redirect", redirect)
		}

		return url.toString()
	}

export interface ServiceOptions {
	service: ServicesNames,
}

export interface RedirectOptions {
	redirect: ServicesNames,
}

export interface DetermineServiceURLOptions
	extends
	ServiceOptions,
	Partial<AccessToken>,
	Partial<RedirectOptions> {}