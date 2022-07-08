import { useSearchParams } from "react-router-dom"
import { ChildrenProps, determineServiceURL } from "@oly_op/musicloud-common"
import { createElement, FC, Fragment, useEffect } from "react"

import { useDispatch, updateAccessToken, useStateAccessToken } from "../../redux"

const Authentication: FC<ChildrenProps> = ({ children }) => {
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