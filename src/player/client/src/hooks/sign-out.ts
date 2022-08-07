import { useEffect, useState } from "react"
import { useApolloClient } from "@apollo/client"
import { ServicesNames } from "@oly_op/musicloud-common/build/types"
import { determineServiceURL } from "@oly_op/musicloud-common/build/determine-service-url"

import { updateAccessToken, useDispatch } from "../redux"

export const useSignOut =
	() => {
		const dispatch = useDispatch()
		const client = useApolloClient()

		const [ isSigningOut, setIsSigningOut ] =
			useState(false)

		const handler =
			() => {
				setIsSigningOut(true)
			}

		useEffect(() => {
			if (isSigningOut) {
				void (async () => {
					await client.clearStore()

					setIsSigningOut(false)
					dispatch(updateAccessToken(null))

					window.location.href =
						determineServiceURL({
							redirect: ServicesNames.PLAYER,
							service: ServicesNames.AUTHENTICATOR,
						})
				})()
			}
		}, [isSigningOut])

		return handler
	}