import { useSearchParams } from "react-router-dom";
import { ServicesNames } from "@oly_op/musicloud-common/build/types";
import { determineServiceURL } from "@oly_op/musicloud-common/build/determine-service-url";
import { createElement, FC, Fragment, useEffect, PropsWithChildren, useState } from "react";

const Authentication: FC<PropsWithChildren> = ({ children }) => {
	const [ok, setOk] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const accessTokenSearchParam = searchParams.get("accessToken");
		const accessTokenLocalStorage = localStorage.getItem("authorization");
		if (accessTokenSearchParam) {
			localStorage.setItem("authorization", accessTokenSearchParam);
			setSearchParams("");
			setOk(true);
		} else if (accessTokenLocalStorage) {
			setOk(true);
		} else {
			window.location.href = determineServiceURL({
				redirect: ServicesNames.UPLOADER,
				service: ServicesNames.AUTHENTICATOR,
			});
		}
	}, []);

	return ok ? <Fragment>{children}</Fragment> : null;
};

export default Authentication;
