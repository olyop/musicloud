import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, useEffect, FC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types"

import Progress from "../progress"
import Controls from "../controls"
import { Handler } from "../../../types"
import { useKeyPress } from "../../../hooks"
import Modal from "../../../components/modal"
import { BarCommonPropTypes } from "../types"
import SongTitle from "../../../components/song-title"
import ObjectLinks from "../../../components/object-links"
import FeaturingArtists from "../../../components/featuring-artists"
import { createObjectPath, createCatalogImageURL } from "../../../helpers"

import "./index.scss"

const bem =	createBEM("BarFullscreen")

const BarFullscreen: FC<PropTypes> = ({
	open,
	audio,
	onClose,
	nowPlaying,
}) => {
	const escapePress = useKeyPress("Escape")

	useEffect(() => {
		if (escapePress) {
			void onClose()
		}
	}, [escapePress])

	return (
		<Modal
			open={open}
			onClose={onClose}
			contentClassName={bem("")}
		>
			<Button
				transparent
				icon="close"
				onClick={onClose}
				title="Close Player"
				className={bem("close")}
			/>
			{nowPlaying && (
				<div className={bem("content", "FlexColumn")}>
					<img
						alt={nowPlaying.album.title}
						crossOrigin="anonymous"
						className={bem("content-cover", "Card")}
						src={createCatalogImageURL(
							nowPlaying.album.albumID,
							"cover",
							ImageSizes.FULL,
							ImageDimensions.SQUARE,
						)}
					/>
					<div className="FlexColumnGapHalf">
						<h1 className={bem("content-title", "content-text")}>
							<SongTitle
								song={nowPlaying}
								onClick={onClose}
							/>
						</h1>
						<h3 className={bem("content-artists", "content-text")}>
							<FeaturingArtists
								song={nowPlaying}
								onClick={onClose}
							/>
						</h3>
						<h2 className={bem("content-genres", "content-text")}>
							<ObjectLinks
								onClick={onClose}
								links={nowPlaying.genres.map(({ genreID, name }) => ({
									text: name,
									path: createObjectPath("genre", genreID),
								}))}
							/>
						</h2>
					</div>
					<Progress
						audio={audio}
						nowPlaying={nowPlaying}
						className={bem("content-progress")}
					/>
					<Controls
						audio={audio}
						nowPlaying={nowPlaying}
						className={bem("content-controls")}
						playButtonClassName={bem("content-controls-play")}
					/>
				</div>
			)}
		</Modal>
	)
}

interface PropTypes extends BarCommonPropTypes {
	open: boolean,
	onClose: Handler,
}

export default BarFullscreen