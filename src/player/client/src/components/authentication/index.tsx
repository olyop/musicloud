import { useSearchParams } from "react-router-dom"
import { determineServiceURL } from "@oly_op/musicloud-common"
import { createElement, FC, Fragment, useEffect, PropsWithChildren } from "react"

import { useDispatch, updateAccessToken, useStateAccessToken } from "../../redux"

const Authentication: FC<PropsWithChildren> = ({ children }) => {
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
						service: "authenticator",
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

export default Authentication