import {
	RedirectPathOptions,
	determineServiceURL,
} from "@oly_op/musicloud-common/build/determine-service-url";
import { AccessToken, ServicesNames } from "@oly_op/musicloud-common/build/types";
import { FC, Fragment, createElement, useEffect } from "react";

const LoggedIn: FC<PropTypes> = ({ accessToken, redirectPath, redirectService }) => {
	const redirectURL = determineServiceURL({
		accessToken,
		service: redirectService,
		servicePath: redirectPath,
	});

	useEffect(() => {
		window.location.href = redirectURL;
	}, []);

	return (
		<div className="FlexColumnGap">
			<h2 className="HeadingFive">Logged In, redirecting...</h2>
			<p className="ParagraphTwo">
				<Fragment>If page does not redirect, </Fragment>
				<a href={redirectURL} className="Link">
					Click Here
				</a>
				<Fragment>.</Fragment>
			</p>
		</div>
	);
};

interface PropTypes extends AccessToken, Partial<RedirectPathOptions> {
	redirectService: ServicesNames;
}

export default LoggedIn;
