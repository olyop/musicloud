import { createElement, FC, Fragment, useEffect } from "react"
import { AccessToken, ServicesNames } from "@oly_op/musicloud-common/build/types"
import { determineServiceURL } from "@oly_op/musicloud-common/build/determine-service-url"

const LoggedIn: FC<PropTypes> = ({ accessToken, redirectService }) => {
	const redirectURL =
		determineServiceURL({
			accessToken,
			service: redirectService,
		})

	useEffect(() => {
		const timer = setTimeout(() => {
			window.location.href = redirectURL
		}, 1000)
		return () => clearTimeout(timer)
	}, [])

	return (
		<div className="FlexColumnGap">
			<h2 className="HeadingFive">
				Logged In, redirecting...
			</h2>
			<p className="ParagraphTwo">
				<Fragment>If page does not redirect, </Fragment>
				<a href={redirectURL} className="Link">
					Click Here
				</a>
				<Fragment>.</Fragment>
			</p>
		</div>
	)
}

interface PropTypes extends AccessToken {
	redirectService: ServicesNames,
}

export default LoggedIn