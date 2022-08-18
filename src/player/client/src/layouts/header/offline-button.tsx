import ms from "ms"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, useEffect, FC } from "react"

import checkOnlineStatus from "./check-online-status"
import { updateIsOnline, useDispatch, useStateIsOnline } from "../../redux"

const bem =
	createBEM("Header")

const HeaderOfflineButton: FC = () => {
	const dispatch = useDispatch()
	const isOnline = useStateIsOnline()

	const checkStatus =
		async () =>
			dispatch(updateIsOnline(await checkOnlineStatus()))

	useEffect(() => {
		window.addEventListener("offline", () => {
			dispatch(updateIsOnline(false))
		})

		const id =
			setInterval(() => {
				void checkStatus()
			}, ms("10s"))

		return () => {
			window.removeEventListener("offline", () => {
				dispatch(updateIsOnline(false))
			})
			clearInterval(id)
		}
	}, [])

	return isOnline ? null : (
		<Button
			transparent
			title="Offline"
			icon="cloud_off"
			className={bem("offline")}
			childrenClassName={bem("offline-span")}
		/>
	)
}

export default HeaderOfflineButton