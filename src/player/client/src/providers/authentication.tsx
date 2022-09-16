import { useSearchParams } from "react-router-dom"
import { ServicesNames } from "@oly_op/musicloud-common/build/types"
import { createElement, FC, Fragment, useEffect, PropsWithChildren } from "react"
import { determineServiceURL } from "@oly_op/musicloud-common/build/determine-service-url"

import { verifyJWT } from "../helpers"
import { useDispatch, updateAccessToken, useStateAccessToken } from "../redux"

export const AuthenticationProvider: FC<PropsWithChildren> = ({ children }) => {
	const dispatch = useDispatch()
	const accessToken = useStateAccessToken()

	const [ searchParams, setSearchParams ] =
		useSearchParams()

	const handleRedirect =
		() => {
			window.location.href =
				determineServiceURL({
					redirect: ServicesNames.PLAYER,
					service: ServicesNames.AUTHENTICATOR,
				})
		}

	useEffect(() => {
		if (searchParams.has("accessToken")) {
			dispatch(updateAccessToken(searchParams.get("accessToken")))
			setSearchParams([])
		} else if (!verifyJWT(accessToken)) {
			handleRedirect()
		}
	}, [])

	return accessToken ? (
		<Fragment>
			{children}
		</Fragment>
	) : null
}