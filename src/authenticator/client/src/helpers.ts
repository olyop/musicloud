import {
	RedirectOptions,
	determineServiceURL,
} from "@oly_op/musicloud-common/build/determine-service-url";
import { TITLE } from "@oly_op/musicloud-common/build/metadata";
import { AccessToken, ServicesNames } from "@oly_op/musicloud-common/build/types";
import isNull from "lodash-es/isNull";

export const isValidServiceName = (
	value: ReturnType<URLSearchParams["get"]>,
): value is ServicesNames => {
	if (isNull(value)) {
		return false;
	} else if (Object.values<string>(ServicesNames).includes(value)) {
		return true;
	} else {
		return false;
	}
};

interface CreateRedirectURLOptions extends RedirectOptions, AccessToken {}

export const createRedirectURL = ({ accessToken, redirect }: CreateRedirectURLOptions) => {
	if (isValidServiceName(redirect)) {
		return null;
	} else {
		return determineServiceURL({
			accessToken,
			service: redirect,
		});
	}
};

export const determineTitle = (checked: boolean, exists: boolean, forgotPassword: boolean) =>
	forgotPassword ? "Forgot Password" : checked ? (exists ? "Log In" : "Sign Up") : TITLE;

export const isEmailAddress = (value: string) =>
	// eslint-disable-next-line max-len
	!isNull(
		value.match(
			// eslint-disable-next-line unicorn/better-regex
			/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
		),
	);
