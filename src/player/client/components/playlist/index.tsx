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
import { createObjectPath } from "../../helpers"
import { ModalButton, ModalButtons } from "../modal"
import { ClassNameBEMPropTypes, ObjectShowIcon, OnClickPropTypes, Playlist as PlaylistType } from "../../types"

const bem =
	createBEM("Playlist")

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
			modalOptions={hideModal ? undefined : {
				header: {
					text: (
						<ObjectLink
							link={{
								text: playlist.title,
								path: createObjectPath("playlist", playlist.playlistID),
							}}
						/>
					),
				},
				content: onClose => (
					<ModalButtons>
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
						<ModalButton
							icon="share"
							text="Share"
							onClose={onClose}
						/>
					</ModalButtons>
				),
			}}
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