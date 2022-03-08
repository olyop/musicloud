import { isNull } from "lodash-es"
import { BEMInput } from "@oly_op/bem"
import { createElement, VFC, Fragment } from "react"
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { ImageDimensions, ImageSizes, SongID } from "@oly_op/musicloud-common"

import {
	useStatePlay,
	useStateShowGenres,
	useStateShowDuration,
} from "../../redux"

import Item from "../item"
import SongTitle from "../song-title"
import ObjectLinks from "../object-links"
import FeaturingArtists from "../featuring-artists"
import QUEUE_SONG_NEXT from "./queue-song-next.gql"
import { ModalButton, ModalButtons } from "../modal"
import QUEUE_SONG_AFTER from "./queue-song-after.gql"
import QUEUE_SONG_LATER from "./queue-song-later.gql"
import { User, Song as SongType, Handler, ObjectShowIcon } from "../../types"
import { useToggleObjectInLibrary, useMutation, usePlaySong } from "../../hooks"
import { createObjectPath, numberWithCommas, createCatalogImageURL, deserializeDuration } from "../../helpers"

const ModalPlayButton: VFC<ModalPlayButtonPropTypes> = ({
	onClose,
	onClick,
	isPlaying,
}) => {
	const play = useStatePlay()
	const playing = play && isPlaying
	return (
		<ModalButton
			onClose={onClose}
			onClick={onClick}
			text={playing ? "Pause" : "Play"}
			icon={playing ? "pause" : "play_arrow"}
		/>
	)
}

interface ModalPlayButtonPropTypes {
	onClose: Handler,
	onClick: Handler,
	isPlaying: boolean,
}

const Song: VFC<PropTypes> = ({
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
	hideDuration = false,
	hideInLibrary = false,
	leftIcon = "audiotrack",
	hideTrackNumber = false,
}) => {
	const {
		album,
		songID,
		genres,
		duration,
		playsTotal,
		trackNumber,
	} = song

	const variables: SongID =
		{ songID }

	const showGenres =
		useStateShowGenres()

	const showDuration =
		useStateShowDuration()

	const [ playSong, isPlaying ] =
		usePlaySong(hidePlay ? undefined : song)

	const [ toggleInLibrary, inLibrary, isError ] =
		useToggleObjectInLibrary(hideInLibrary ? undefined : song)

	const [ next, { loading: nextLoading } ] =
		useMutation<QueueData, SongID>(
			QUEUE_SONG_NEXT,
			{ variables },
		)

	const [ after, { loading: afterLoading } ] =
		useMutation<QueueData, SongID>(
			QUEUE_SONG_AFTER,
			{ variables },
		)

	const [ later, { loading: laterLoading } ] =
		useMutation<QueueData, SongID>(
			QUEUE_SONG_LATER,
			{ variables },
		)

	const loading =
		nextLoading || afterLoading || laterLoading

	const handleNextClick =
		() => { void next() }

	const handleAfterClick =
		() => { void after() }

	const handleLaterClick =
		() => { void later() }

	return (
		<Item
			onRemove={onRemove}
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
			inLibraryOptions={
				hideInLibrary ? undefined : {
					isError,
					inLibrary,
					onClick: toggleInLibrary,
				}
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
					(hidePlays || isNull(playsTotal)) ?
						null : numberWithCommas(playsTotal)
				),
			}}
			modalOptions={hideModal ? undefined : onClose => ({
				header: {
					shareData: {
						title: song.title,
						url: createObjectPath("song", songID),
					},
					text: (
						<SongTitle
							noLink
							song={song}
							onClick={onClose}
						/>
					),
					image: {
						description: album.title,
						src: createCatalogImageURL(
							album.albumID,
							"cover",
							ImageSizes.HALF,
							ImageDimensions.SQUARE,
						),
					},
				},
				content: (
					<ModalButtons>
						{hidePlay || (
							<ModalPlayButton
								onClose={onClose}
								onClick={playSong}
								isPlaying={isPlaying}
							/>
						)}
						<ModalButton
							text="Next"
							onClose={onClose}
							icon="playlist_add"
							onClick={loading ? undefined : handleNextClick}
						/>
						<ModalButton
							text="After"
							onClose={onClose}
							icon="queue_music"
							onClick={loading ? undefined : handleAfterClick}
						/>
						<ModalButton
							text="Later"
							icon="queue"
							onClose={onClose}
							onClick={loading ? undefined : handleLaterClick}
						/>
						<ModalButton
							icon="album"
							text="Album"
							onClose={onClose}
							link={createObjectPath("album", album.albumID)}
						/>
						<ModalButton
							icon="person"
							text="Artist"
							onClose={onClose}
							link={createObjectPath("artist", song.artists[0]!.artistID)}
						/>
						{hideInLibrary || (
							<ModalButton
								text="Library"
								onClose={onClose}
								onClick={toggleInLibrary}
								icon={inLibrary ? "done" : "add"}
							/>
						)}
						<ModalButton
							text="Playlist"
							onClose={onClose}
							icon="playlist_add"
							link={`/add-song-to-playlist/${removeDashesFromUUID(songID)}`}
						/>
						{onRemove && (
							<ModalButton
								text="Remove"
								onClose={onClose}
								icon="queue_music"
								onClick={onRemove}
							/>
						)}
					</ModalButtons>
				),
			})}
		/>
	)
}

interface QueueData {
	user: User,
}

interface PropTypes extends ObjectShowIcon {
	song: SongType,
	index?: number,
	onJump?: Handler,
	leftIcon?: string,
	onRemove?: Handler,
	hidePlay?: boolean,
	className?: string,
	hideCover?: boolean,
	hidePlays?: boolean,
	hideModal?: boolean,
	hideDuration?: boolean,
	hideInLibrary?: boolean,
	iconClassName?: BEMInput,
	hideTrackNumber?: boolean,
}

export default Song