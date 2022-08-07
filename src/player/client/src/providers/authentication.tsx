import { useSearchParams } from "react-router-dom"
import { ServicesNames } from "@oly_op/musicloud-common/build/types"
import { createElement, FC, Fragment, useEffect, PropsWithChildren } from "react"
import { determineServiceURL } from "@oly_op/musicloud-common/build/determine-service-url"

import { useDispatch, updateAccessToken, useStateAccessToken } from "../redux"

export const AuthenticationProvider: FC<PropsWithChildren> = ({ children }) => {
	const dispatch = useDispatch()
	const accessToken = useStateAccessToken()

	const [ searchParams, setSearchParams ] =
		useSearchParams()

	useEffect(() => {
		if (searchParams.has("accessToken")) {
			dispatch(updateAccessToken(searchParams.get("accessToken")))
			setSearchParams("")
		} else {
			if (!accessToken) {
				window.location.href =
					determineServiceURL({
						redirect: ServicesNames.PLAYER,
						service: ServicesNames.AUTHENTICATOR,
					})
			}
		}
	}, [])

	return accessToken ? (
		<Fragment>
			{children}
		</Fragment>
	) : null
}