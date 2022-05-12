import { useEffect, useState } from "react"
import { useApolloClient } from "@apollo/client"

import { updateAccessToken, useDispatch } from "../redux"

export const useSignOut =
	() => {
		const dispatch = useDispatch()
		const client = useApolloClient()

		const [ isSigningOut, setIsSigningOut ] = useState(false)

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
				})()
			}
		}, [isSigningOut])

		return handler
	}