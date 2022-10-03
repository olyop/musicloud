import Button from "@oly_op/react-button"
import { createElement, FC } from "react"

import { useShare } from "../../hooks"

const ShareButton: FC = () => {

	const [ share, { shareIcon, shareText } ] =
		useShare()

	const handleShare =
		() => {
			share({
				title: "Top #100",
				url: "/top-one-hundred-songs",
			})
		}
	return (
		<Button
			transparent
			icon={shareIcon}
			onClick={handleShare}
			text={shareText || undefined}
		/>
	)
}

export default ShareButton