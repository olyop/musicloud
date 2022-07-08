import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, useEffect, FC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common"

import Modal from "../../modal"
import Progress from "../progress"
import Controls from "../controls"
import SongTitle from "../../song-title"
import ObjectLinks from "../../object-links"
import { useKeyPress } from "../../../hooks"
import { Song, Handler } from "../../../types"
import FeaturingArtists from "../../featuring-artists"
import { createObjectPath, createCatalogImageURL } from "../../../helpers"

import "./index.scss"

const bem =
	createBEM("BarFullscreen")

const BarFullscreen: FC<PropTypes> = ({
	open,
	song,
	ready,
	onClose,
	isNowPlaying,
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
			{song && (
				<div className={bem("content", "FlexColumn")}>
					<img
						alt={song.album.title}
						crossOrigin="anonymous"
						className={bem("content-cover", "Card")}
						src={createCatalogImageURL(
							song.album.albumID,
							"cover",
							ImageSizes.FULL,
							ImageDimensions.SQUARE,
						)}
					/>
					<div className="FlexColumnGapHalf">
						<h1 className={bem("content-title", "content-text")}>
							<SongTitle
								noLink
								song={song}
								onClick={onClose}
							/>
						</h1>
						<h3 className={bem("content-artists", "content-text")}>
							<FeaturingArtists
								song={song}
								onClick={onClose}
							/>
						</h3>
						<h2 className={bem("content-genres", "content-text")}>
							<ObjectLinks
								onClick={onClose}
								links={song.genres.map(({ genreID, name }) => ({
									text: name,
									path: createObjectPath("genre", genreID),
								}))}
							/>
						</h2>
					</div>
					<Progress
						ready={ready}
						isNowPlaying={isNowPlaying}
						className={bem("content-progress")}
					/>
					<Controls
						ready={ready}
						isNowPlaying={isNowPlaying}
						className={bem("content-controls")}
						playButtonClassName={bem("content-controls-play")}
					/>
				</div>
			)}
		</Modal>
	)
}

interface PropTypes {
	open: boolean,
	ready: boolean,
	onClose: Handler,
	song?: Song | null,
	isNowPlaying: boolean,
}

export default BarFullscreen