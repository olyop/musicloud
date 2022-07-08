import { createElement, FC, Fragment, useEffect } from "react"
import { AccessToken, determineServiceURL } from "@oly_op/musicloud-common"

const LoggedIn: FC<AccessToken> = ({ accessToken }) => {
	const redirectURL =
		determineServiceURL({ accessToken, service: "player" })

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
			<p className="BodyTwo">
				<Fragment>If page does not redirect, </Fragment>
				<a href={redirectURL}>
					Click Here
				</a>
				<Fragment>.</Fragment>
			</p>
		</div>
	)
}

export default LoggedIn