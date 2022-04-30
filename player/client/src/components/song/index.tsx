import isNull from "lodash-es/isNull"
import { BEMInput } from "@oly_op/bem"
import { createElement, FC, Fragment } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common"

import {
	createObjectPath,
	numberWithCommas,
	deserializeDuration,
	createCatalogImageURL,
} from "../../helpers"

import Item from "../item"
import Modal from "./modal"
import SongTitle from "../song-title"
import ObjectLinks from "../object-links"
import { usePlaySong } from "../../hooks"
import FeaturingArtists from "../featuring-artists"
import { useStateShowGenres, useStateShowDuration } from "../../redux"
import { Song as SongType, Handler, ObjectShowIcon } from "../../types"

const Song: FC<PropTypes> = ({
	song,
	index,
	onJump,
	onRemove,
	className,
	iconClassName,
	showIcon = false,
	hidePlay = false,
	hideCover = false,
	hidePlays = false,
	hideModal = false,
	shareIcon = false,
	hideDuration = false,
	hideInLibrary = false,
	leftIcon = "audiotrack",
	hideTrackNumber = false,
}) => {
	const { album, genres, duration, playsTotal, trackNumber } = song

	const showGenres =
		useStateShowGenres()

	const showDuration =
		useStateShowDuration()

	const [ playSong, isPlaying ] =
		usePlaySong(hidePlay ? undefined : song)

	return (
		<Item
			onRemove={onRemove}
			shareIcon={shareIcon}
			className={className}
			iconClassName={iconClassName}
			leftIcon={showIcon ? leftIcon : undefined}
			left={index || (hideTrackNumber ? null : trackNumber)}
			imageOptions={
				hideCover ? undefined : {
					title: album.title,
					path: createObjectPath(
						"album",
						album.albumID,
					),
					url: createCatalogImageURL(
						album.albumID,
						"cover",
						ImageSizes.HALF,
						ImageDimensions.SQUARE,
					),
				}
			}
			playOptions={
				onJump ? {
					onClick: onJump,
					isPlaying: false,
				} : (
					hidePlay ? undefined : {
						isPlaying,
						onClick: playSong,
					}
				)
			}
			infoOptions={{
				upperLeft: (
					<SongTitle
						song={song}
						onClick={playSong}
					/>
				),
				lowerLeft: (
					<Fragment>
						<FeaturingArtists
							song={song}
						/>
						{showGenres && (
							<Fragment>
								<Fragment> &#8226; </Fragment>
								<ObjectLinks
									ampersand
									links={genres.map(
										({ genreID, name }) => ({
											text: name,
											path: createObjectPath("genre", genreID),
										}),
									)}
								/>
							</Fragment>
						)}
					</Fragment>
				),
				rightRight: (
					showDuration ?
						(hideDuration ?
							null : deserializeDuration(duration)) :
						null
				),
				rightLeft: (
					hidePlays || isNull(playsTotal) ?
						null : numberWithCommas(playsTotal)
				),
			}}
			modal={hideModal ? undefined : ({ open, onClose }) => (
				<Modal
					open={open}
					song={song}
					onClose={onClose}
					hidePlay={hidePlay}
					onRemove={onRemove}
					hideInLibrary={hideInLibrary}
				/>
			)}
		/>
	)
}

interface PropTypes extends ObjectShowIcon {
	song: SongType,
	index?: number,
	onJump?: Handler,
	leftIcon?: string,
	onRemove?: Handler,
	hidePlay?: boolean,
	className?: string,
	shareIcon?: boolean,
	hideCover?: boolean,
	hidePlays?: boolean,
	hideModal?: boolean,
	hideDuration?: boolean,
	hideInLibrary?: boolean,
	iconClassName?: BEMInput,
	hideTrackNumber?: boolean,
}

export default Song