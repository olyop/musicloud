import { DOMAIN_NAME } from "./metadata"
import { AccessToken, ServicesNames } from "./types"
import { IS_DEVELOPMENT, IS_TESTING, USE_HTTPS } from "./globals"

const determineDevelopmentPort =
	({ service }: ServiceOptions) => {
		if (service === ServicesNames.PLAYER) {
			return process.env.PLAYER_CLIENT_PORT
		} else if (service === ServicesNames.UPLOADER) {
			return process.env.UPLOADER_CLIENT_PORT
		} else {
			return process.env.AUTHENTICATOR_CLIENT_PORT
		}
	}

export const determinePort =
	({ service }: ServiceOptions) => {
		if (service === ServicesNames.PLAYER) {
			return process.env.PLAYER_SERVER_PORT
		} else if (service === ServicesNames.UPLOADER) {
			return process.env.UPLOADER_SERVER_PORT
		} else {
			return process.env.AUTHENTICATOR_SERVER_PORT
		}
	}

export const determineServiceURL =
	({ service, redirect, accessToken }: DetermineServiceURLOptions) => {
		let url: URL

		const protocol =
			(IS_DEVELOPMENT || IS_TESTING) ?
				(USE_HTTPS ? "https" : "http") :
				"https"

		if (IS_DEVELOPMENT || IS_TESTING) {
			const port =
				IS_DEVELOPMENT ?
					determineDevelopmentPort({ service }) :
					determinePort({ service })

			url = new URL(`${protocol}://${process.env.HOST}:${port}`)
		} else {
			url = new URL(`${protocol}://${service}.${DOMAIN_NAME}`)
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