import isNull from "lodash/isNull"
import { BEMInput } from "@oly_op/bem"
import { createElement, FC, Fragment } from "react"
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import deserializeDuration from "@oly_op/music-app-common/deserialize-duration"
import { ImageDimensions, ImageSizes, SongIDBase } from "@oly_op/music-app-common/types"

import {
	numberWithCommas,
	determineObjectPath,
	determineCatalogMP3URL,
	determineCatalogImageURL,
} from "../../helpers"

import Item from "../item"
import SongTitle from "../song-title"
import ObjectLinks from "../object-links"
import FeaturingArtists from "../featuring-artists"
import QUEUE_SONG_NEXT from "./queue-song-next.gql"
import QUEUE_SONG_AFTER from "./queue-song-after.gql"
import QUEUE_SONG_LATER from "./queue-song-later.gql"
import { User, Song as SongType, Handler } from "../../types"
import { useStateShowDuration, useStateShowGenres } from "../../redux"
import { useToggleInLibrary, useMutation, usePlaySong } from "../../hooks"

const Song: FC<PropTypes> = ({
	song,
	index,
	onClose,
	className,
	iconClassName,
	leftIcon = false,
	hidePlay = false,
	hideMore = false,
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

	const variables: SongIDBase = { songID }
	const showGenres = useStateShowGenres()
	const showDuration = useStateShowDuration()

	const [ playSong, isPlaying ] =
		usePlaySong(song)

	const [ toggleInLibrary, inLibrary ] =
		useToggleInLibrary(song)

	const [ next, { loading: nextLoading } ] =
		useMutation<QueueData, SongIDBase>(QUEUE_SONG_NEXT, { variables })

	const [ after, { loading: afterLoading } ] =
		useMutation<QueueData, SongIDBase>(QUEUE_SONG_AFTER, { variables })

	const [ later, { loading: laterLoading } ] =
		useMutation<QueueData, SongIDBase>(QUEUE_SONG_LATER, { variables })

	const loading =
		nextLoading || afterLoading || laterLoading

	const handleNextClick =
		async () => { await next() }

	const handleAfterClick =
		async () => { await after() }

	const handleLaterClick =
		async () => { await later() }

	return (
		<Item
			onClose={onClose}
			className={className}
			iconClassName={iconClassName}
			leftIcon={leftIcon ? "audiotrack" : undefined}
			left={index || (hideTrackNumber ? null : trackNumber)}
			imageOptions={hideCover ? undefined : {
				title: album.title,
				path: determineObjectPath("album", album.albumID),
				url: determineCatalogImageURL(
					album.albumID,
					"cover",
					ImageSizes.HALF,
					ImageDimensions.SQUARE,
				),
			}}
			playOptions={hidePlay ? undefined : {
				isPlaying,
				onClick: playSong,
			}}
			inLibraryOptions={hideInLibrary ? undefined : {
				inLibrary,
				onClick: toggleInLibrary,
			}}
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
									links={genres.map(({ genreID, name }) => ({
										text: name,
										path: determineObjectPath("genre", genreID),
									}))}
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
			modalHeader={{
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
			}}
			modalButtons={hideMore ? undefined : [{
				onClick: playSong,
				text: isPlaying ? "Pause" : "Play",
				icon: isPlaying ? "pause" : "play_arrow",
			},{
				icon: "radio",
				text: "Radio",
			},{
				text: "Next",
				icon: "playlist_add",
				onClick: loading ? undefined : handleNextClick,
			},{
				text: "After",
				icon: "queue_music",
				onClick: loading ? undefined : handleAfterClick,
			},{
				icon: "queue",
				text: "Later",
				onClick: loading ? undefined : handleLaterClick,
			},{
				icon: "get_app",
				text: "Download",
				externalLink: true,
				link: determineCatalogMP3URL(songID),
				externalLinkProps: { type: "audio/mpeg", download: true },
			},{
				onClick: toggleInLibrary,
				icon: inLibrary ? "done" : "add",
				text: inLibrary ? "Remove" : "Add",
			},{
				text: "Playlist",
				icon: "playlist_add",
				link: `/add-song-to-playlist/${removeDashesFromUUID(songID)}`,
			},{
				icon: "info",
				text: "Info",
				link: determineObjectPath("song", songID),
			}]}
		/>
	)
}

interface QueueData {
	user: User,
}

interface PropTypes {
	song: SongType,
	index?: number,
	onClose?: Handler,
	leftIcon?: boolean,
	hidePlay?: boolean,
	className?: string,
	hideMore?: boolean,
	hideCover?: boolean,
	hidePlays?: boolean,
	hideDuration?: boolean,
	hideInLibrary?: boolean,
	iconClassName?: BEMInput,
	hideTrackNumber?: boolean,
}

export default Song