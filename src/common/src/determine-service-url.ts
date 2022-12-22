import { IS_DEVELOPMENT, IS_TESTING, USE_HTTPS } from "./globals";
import { DOMAIN_NAME } from "./metadata";
import { AccessToken, ServicesNames } from "./types";

const determineDevelopmentPort = ({ service }: ServiceOptions) => {
	if (service === ServicesNames.PLAYER) {
		return process.env.PLAYER_CLIENT_PORT;
	} else if (service === ServicesNames.UPLOADER) {
		return process.env.UPLOADER_CLIENT_PORT;
	} else {
		return process.env.AUTHENTICATOR_CLIENT_PORT;
	}
};

export const determinePort = ({ service }: ServiceOptions) => {
	if (service === ServicesNames.PLAYER) {
		return process.env.PLAYER_SERVER_PORT;
	} else if (service === ServicesNames.UPLOADER) {
		return process.env.UPLOADER_SERVER_PORT;
	} else {
		return process.env.AUTHENTICATOR_SERVER_PORT;
	}
};

const determineOrigin = ({ service }: ServiceOptions) => {
	const protocol = IS_DEVELOPMENT || IS_TESTING ? (USE_HTTPS ? "https" : "http") : "https";

	if (IS_DEVELOPMENT || IS_TESTING) {
		const port = IS_DEVELOPMENT
			? determineDevelopmentPort({ service })
			: determinePort({ service });

		return `${protocol}://${process.env.HOST}:${port}`;
	} else {
		return `${protocol}://${service}.${DOMAIN_NAME}`;
	}
};

export const determineServiceURL = ({
	service,
	servicePath,
	redirect,
	redirectPath,
	accessToken,
}: DetermineServiceURLOptions) => {
	const origin = determineOrigin({ service });
	const path = servicePath || "";
	const url = new URL(`${origin}${path}`);

	if (accessToken) {
		url.searchParams.append("accessToken", accessToken);
	}

	if (redirect) {
		url.searchParams.append("redirect", redirect);
	}

	if (redirectPath) {
		url.searchParams.append("redirectPath", redirectPath);
	}

	return url.toString();
};

export interface ServiceOptions {
	service: ServicesNames;
}

export interface ServicePathOptions {
	servicePath: string;
}

export interface RedirectOptions {
	redirect: ServicesNames;
}

export interface RedirectPathOptions {
	redirectPath: string;
}

export interface DetermineServiceURLOptions
	extends ServiceOptions,
		Partial<AccessToken>,
		Partial<RedirectOptions>,
		Partial<ServicePathOptions>,
		Partial<RedirectPathOptions> {}
