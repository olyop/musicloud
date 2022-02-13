import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, VFC } from "react"

import "./index.scss"

const bem =
	createBEM("Footer")

const Footer: VFC = () => (
	<a
		target="_blank"
		rel="noreferrer"
		href="https://musicloud-app.com"
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