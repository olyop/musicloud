import Button from "@oly_op/react-button"
import { createElement, VFC } from "react"

const bem =
	createBEM("Header")

const HeaderIsOnlineButton: VFC = () => {
	return (
		isOnline ? (
			<Button
				transparent
				text="Offline"
				title="Account"
				icon="cloud_off"
				className={bem("offline")}
				spanClassName={bem("offline-span")}
			/>
		) : null
	)
}

export default HeaderIsOnlineButton