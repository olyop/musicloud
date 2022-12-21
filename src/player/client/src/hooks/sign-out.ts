import { determineServiceURL } from "@oly_op/musicloud-common/build/determine-service-url";
import { ServicesNames } from "@oly_op/musicloud-common/build/types";
import { useEffect, useState } from "react";

import { updateAccessToken, useDispatch } from "../redux";
import { useClearCache } from "./clear-cache";

export const useSignOut = () => {
	const dispatch = useDispatch();
	const clearCache = useClearCache();

	const [isSigningOut, setIsSigningOut] = useState(false);

	const handler = () => {
		setIsSigningOut(true);
	};

	const signOut = async () => {
		await clearCache();
		setIsSigningOut(false);
		dispatch(updateAccessToken(null));

		window.location.href = determineServiceURL({
			redirect: ServicesNames.PLAYER,
			redirectPath: location.pathname,
			service: ServicesNames.AUTHENTICATOR,
		});
	};

	useEffect(() => {
		if (isSigningOut) {
			void signOut();
		}
	}, [isSigningOut]);

	return handler;
};
