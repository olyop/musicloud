import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"
import { FILES_URL } from "@oly_op/musicloud-common/build/globals"

import { useStateTheme } from "../../redux"
import { SettingsTheme } from "../../types"

const bem =
	createBEM("SearchPage")

const AlgoliaLogo: FC = () => {
	const theme = useStateTheme()

	const fileName =
		theme === SettingsTheme.DARK ?
			"white" : "blue"

	return (
		<img
			alt="Search by Algolia"
			src={`${FILES_URL}/algolia/${fileName}.svg`}
			className={bem("bar-input-right-algolia", "Rounded")}
		/>
	)
}

export default AlgoliaLogo