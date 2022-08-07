import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, FC } from "react"
import { ServicesNames } from "@oly_op/musicloud-common/build/types"
import { determineServiceURL } from "@oly_op/musicloud-common/build/determine-service-url"

import "./index.scss"

const bem =
	createBEM("Footer")

const Footer: FC = () => (
	<a
		target="_blank"
		rel="noreferrer"
		className={bem("", "Elevated")}
		href={determineServiceURL({ service: ServicesNames.PLAYER })}
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