import { createBEM } from "@oly_op/bem"
import { createElement, VFC } from "react"

import {
	useJWTPayload,
	usePlayPlaylist,
	useShufflePlaylist,
	useToggleObjectInLibrary,
} from "../../hooks"

import Item from "../item"
import ObjectLink from "../object-link"
import { useStatePlay } from "../../redux"
import { createObjectPath } from "../../helpers"
import { ModalButton, ModalButtons } from "../modal"
import { ClassNameBEMPropTypes, Handler, ObjectShowIcon, OnClickPropTypes, Playlist as PlaylistType } from "../../types"

const bem =
	createBEM("Playlist")

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

const Playlist: VFC<PropTypes> = ({
	onClick,
	playlist,
	className,
	showIcon = false,
	hideModal = false,
	hideInLibrary = false,
}) => {
	const { playlistID } = playlist
	const { userID } = useJWTPayload()

	const isOwnPlaylist =
		userID === playlist.user.userID

	const [ playPlaylist, isPlaying ] =
		usePlayPlaylist({ playlistID })

	const [ shufflePlaylist ] =
		useShufflePlaylist({ playlistID })

	const [ toggleInLibrary, inLibrary, isError ] =
		useToggleObjectInLibrary(playlist)

	return (
		<Item
			onClick={onClick}
			className={bem(className)}
			leftIcon={showIcon ? "queue_music" : undefined}
			infoOptions={{
				upperLeft: onClick ? playlist.title : (
					<ObjectLink
						link={{
							text: playlist.title,
							path: createObjectPath("playlist", playlist.playlistID),
						}}
					/>
				),
				lowerLeft: (
					<ObjectLink
						link={{
							text: playlist.user.name,
							path: createObjectPath("user", playlist.user.userID),
						}}
					/>
				),
			}}
			playOptions={{
				isPlaying,
				onClick: playPlaylist,
			}}
			inLibraryOptions={isOwnPlaylist || hideInLibrary ? undefined : {
				isError,
				inLibrary,
				onClick: toggleInLibrary,
			}}
			modalOptions={hideModal ? undefined : onClose => ({
				header: {
					icon: "queue_music",
					shareData: {
						title: playlist.title,
						url: createObjectPath("playlist", playlistID),
					},
					text: (
						<ObjectLink
							link={{
								text: playlist.title,
								path: createObjectPath("playlist", playlist.playlistID),
							}}
						/>
					),
				},
				content: (
					<ModalButtons>
						<ModalPlayButton
							onClose={onClose}
							isPlaying={isPlaying}
							onClick={playPlaylist}
						/>
						{hideInLibrary || isOwnPlaylist || (
							<ModalButton
								onClose={onClose}
								onClick={toggleInLibrary}
								icon={inLibrary ? "done" : "add"}
								text={inLibrary ? "Remove" : "Add"}
							/>
						)}
						<ModalButton
							icon="shuffle"
							text="Shuffle"
							onClose={onClose}
							onClick={shufflePlaylist}
						/>
					</ModalButtons>
				),
			})}
		/>
	)
}

interface PropTypes
	extends
	ObjectShowIcon,
	OnClickPropTypes,
	ClassNameBEMPropTypes {
	hideModal?: boolean,
	playlist: PlaylistType,
	hideInLibrary?: boolean,
}

export default Playlist