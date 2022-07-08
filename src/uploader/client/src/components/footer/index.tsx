import { createBEM } from "@oly_op/bem"
import { determineServiceURL } from "@oly_op/musicloud-common"
import Button from "@oly_op/react-button"
import { createElement, FC } from "react"

import "./index.scss"

const bem =
	createBEM("Footer")

const Footer: FC = () => (
	<a
		target="_blank"
		rel="noreferrer"
		className={bem("", "Elevated")}
		href={determineServiceURL({ service: "player" })}
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