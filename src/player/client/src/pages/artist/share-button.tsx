import Button from "@oly_op/react-button"
import { createElement, FC } from "react"

import { useShare } from "../../hooks"
import { createObjectPath } from "../../helpers"
import { Artist } from "../../types"

const ShareButton: FC<PropTypes> = ({ artist, width }) => {
	const [ share, shareText ] = useShare()

	const handleShare =
		() => {
			share({
				title: artist.name,
				url: createObjectPath("artist", artist.artistID),
			})
		}

	return (
		<Button
			icon="share"
			onClick={handleShare}
			text={width > 700 ? (shareText || "Share") : undefined}
		/>
	)
}

interface PropTypes {
	width: number,
	artist: Pick<Artist, "artistID" | "name">,
}

export default ShareButton