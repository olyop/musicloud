import { useEffect, useState } from "react"
import { ServicesNames } from "@oly_op/musicloud-common/build/types"
import { determineServiceURL } from "@oly_op/musicloud-common/build/determine-service-url"

import { useClearCache } from "./clear-reset-cache"
import { updateAccessToken, useDispatch } from "../redux"

export const useSignOut =
	() => {
		const dispatch = useDispatch()
		const clearCache = useClearCache()

		const [ isSigningOut, setIsSigningOut ] =
			useState(false)

		const handler =
			() => {
				setIsSigningOut(true)
			}

		const signOut =
			async () => {
				await clearCache()
				setIsSigningOut(false)
				dispatch(updateAccessToken(null))

				window.location.href =
					determineServiceURL({
						redirect: ServicesNames.PLAYER,
						redirectPath: location.pathname,
						service: ServicesNames.AUTHENTICATOR,
					})
			}

		useEffect(() => {
			if (isSigningOut) {
				void signOut()
			}
		}, [isSigningOut])

		return handler
	}