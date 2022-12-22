import { determineServiceURL } from "@oly_op/musicloud-common/build/determine-service-url";
import { ServicesNames } from "@oly_op/musicloud-common/build/types";
import { FC, Fragment, PropsWithChildren, createElement, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { verifyJWT } from "../helpers";
import { updateAccessToken, useDispatch, useStateAccessToken } from "../redux";

const handleRedirect = () => {
	window.location.href = determineServiceURL({
		redirect: ServicesNames.PLAYER,
		service: ServicesNames.AUTHENTICATOR,
	});
};

export const AuthenticationProvider: FC<PropsWithChildren> = ({ children }) => {
	const dispatch = useDispatch();
	const accessToken = useStateAccessToken();

	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		if (searchParams.has("accessToken")) {
			dispatch(updateAccessToken(searchParams.get("accessToken")));
			setSearchParams([]);
		} else if (!verifyJWT(accessToken)) {
			handleRedirect();
		}
	}, []);

	return accessToken ? <Fragment>{children}</Fragment> : null;
};
