import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, VFC } from "react"

import "./index.scss"

const musicloudURL =
	`http://localhost:${process.env.PLAYER_CLIENT_PORT}`

const bem =
	createBEM("Footer")

const Footer: VFC = () => (
	<a
		href={musicloudURL}
		className={bem("", "Elevated")}
		children={(
			<Button
				transparent
				text="Musicloud"
				icon="arrow_back"
				className={bem("button")}
			/>
		)}
	/>
)

export default Footer