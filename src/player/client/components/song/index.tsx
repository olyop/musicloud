import isNull from "lodash/isNull"
import isString from "lodash/isString"
import { BEMInput } from "@oly_op/bem"
import { createElement, VFC, Fragment } from "react"
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import deserializeDuration from "@oly_op/music-app-common/deserialize-duration"
import { ImageDimensions, ImageSizes, SongID } from "@oly_op/music-app-common/types"

import {
	numberWithCommas,
	determineObjectPath,
	determineCatalogMP3URL,
	determineCatalogImageURL,
} from "../../helpers"

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
import { User, Song as SongType, Handler } from "../../types"
import { useToggleObjectInLibrary, useMutation, usePlaySong } from "../../hooks"

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
	leftIcon = false,
	hidePlay = false,
	hideCover = false,
	hidePlays = false,
	hideDuration = false,
	hideInLibrary = false,
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
		usePlaySong(song)

	const [ toggleInLibrary, inLibrary ] =
		useToggleObjectInLibrary(song)

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
		async () => {
			await next()
		}

	const handleAfterClick =
		async () => {
			await after()
		}

	const handleLaterClick =
		async () => {
			await later()
		}

	return (
		<Item
			onRemove={onRemove}
			className={className}
			iconClassName={iconClassName}
			left={index || (hideTrackNumber ? null : trackNumber)}
			leftIcon={
				isString(leftIcon) ?
					leftIcon : (
						leftIcon ?
							"audiotrack" :
							undefined
					)
			}
			imageOptions={
				hideCover ? undefined : {
					title: album.title,
					path: determineObjectPath(
						"album",
						album.albumID,
					),
					url: determineCatalogImageURL(
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
					isPlaying: true,
				} : (
					hidePlay ? undefined : {
						isPlaying,
						onClick: playSong,
					}
				)
			}
			inLibraryOptions={
				hideInLibrary ? undefined : {
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
											path: determineObjectPath("genre", genreID),
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
			modalOptions={{
				header: {
					text: (
						<SongTitle
							song={song}
						/>
					),
					imgPropTypes: {
						title: album.title,
						url: determineCatalogImageURL(
							album.albumID,
							"cover",
							ImageSizes.HALF,
							ImageDimensions.SQUARE,
						),
					},
				},
				content: onClose => (
					<ModalButtons>
						<ModalPlayButton
							onClose={onClose}
							onClick={playSong}
							isPlaying={isPlaying}
						/>
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
							link={determineObjectPath("album", album.albumID)}
						/>
						<ModalButton
							icon="person"
							text="Artist"
							onClose={onClose}
							link={determineObjectPath("artist", song.artists[0]!.artistID)}
						/>
						<ModalButton
							text="Library"
							onClose={onClose}
							onClick={toggleInLibrary}
							icon={inLibrary ? "done" : "add"}
						/>
						<ModalButton
							externalLink
							icon="get_app"
							text="Download"
							link={determineCatalogMP3URL(songID)}
							externalLinkProps={{ type: "audio/mpeg", download: true }}
						/>
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
						<ModalButton
							icon="info"
							text="Info"
							onClose={onClose}
							link={determineObjectPath("song", songID)}
						/>
					</ModalButtons>
				),
			}}
		/>
	)
}

interface QueueData {
	user: User,
}

interface PropTypes {
	song: SongType,
	index?: number,
	onJump?: Handler,
	onRemove?: Handler,
	hidePlay?: boolean,
	className?: string,
	hideCover?: boolean,
	hidePlays?: boolean,
	hideDuration?: boolean,
	hideInLibrary?: boolean,
	iconClassName?: BEMInput,
	hideTrackNumber?: boolean,
	leftIcon?: boolean | string,
}

export default Song