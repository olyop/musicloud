import Button from "@oly_op/react-button"
import { createElement, FC } from "react"

import { Album } from "../../types"
import { useShare } from "../../hooks"
import { createObjectPath } from "../../helpers"

const ShareButton: FC<PropTypes> = ({ album }) => {
	const [ share, shareText ] = useShare()

	const handleShare =
		() => {
			share({
				title: album.title,
				url: createObjectPath("album", album.albumID),
			})
		}

	return (
		<Button
			icon="share"
			onClick={handleShare}
			text={shareText || "Share"}
		/>
	)
}

interface PropTypes {
	album: Pick<Album, "albumID" | "title">,
}

export default ShareButton