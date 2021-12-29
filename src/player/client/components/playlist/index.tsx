import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { useState, createElement, Fragment, VFC } from "react"

import {
	useJWTPayload,
	usePlayPlaylist,
	useDeletePlaylist,
	useShufflePlaylist,
	useUpdatePlaylistTitle,
	useToggleObjectInLibrary,
} from "../../hooks"

import Item from "../item"
import TextField from "../text-field"
import ObjectLink from "../object-link"
import Modal, { ModalButton, ModalButtons } from "../modal"
import { determineObjectPath } from "../../helpers"
import { ClassNameBEMPropTypes, Handler, OnClickPropTypes, Playlist as PlaylistType } from "../../types"

const bem =
	createBEM("Playlist")

const Playlist: VFC<PropTypes> = ({
	onClick,
	playlist,
	className,
	leftIcon = false,
	hideModal = false,
	hideInLibrary = false,
}) => {
	const { playlistID } = playlist
	const { userID } = useJWTPayload()

	const [ renameModal, setRenameModal ] =
		useState(false)

	const [ renameTitle, setRenameTitle ] =
		useState("")

	const [ toggleInLibrary, inLibrary ] =
		useToggleObjectInLibrary(playlist)

	const [ playPlaylist, isPlaying ] =
		usePlayPlaylist({ playlistID })

	const [ shufflePlaylist ] =
		useShufflePlaylist({ playlistID })

	const [ renamePlaylist ] =
		useUpdatePlaylistTitle({ playlistID })

	const [ deletePlaylist ] =
		useDeletePlaylist({ playlistID })

	const handleRenameModalClose =
		() => setRenameModal(false)

	const handleRenameModalOpen =
		(onClose: Handler) => () => {
			void onClose()
			setRenameModal(true)
		}

	const handleTitleRenameChange =
		(value: string) =>
			setRenameTitle(value)

	const handleTitleRenameSubmit =
		async () => {
			handleRenameModalClose()
			await renamePlaylist({ title: renameTitle })
		}

	return (
		<Fragment>
			<Item
				onClick={onClick}
				className={bem(className)}
				leftIcon={leftIcon ? "queue_music" : undefined}
				infoOptions={{
					upperLeft: onClick ? playlist.title : (
						<ObjectLink
							link={{
								text: playlist.title,
								path: determineObjectPath("playlist", playlist.playlistID),
							}}
						/>
					),
					lowerLeft: (
						<ObjectLink
							link={{
								text: playlist.user.name,
								path: determineObjectPath("user", playlist.user.userID),
							}}
						/>
					),
				}}
				playOptions={{
					isPlaying,
					onClick: playPlaylist,
				}}
				inLibraryOptions={hideInLibrary ? undefined : {
					inLibrary,
					onClick: toggleInLibrary,
				}}
				modalOptions={hideModal ? undefined : {
					header: {
						text: (
							<ObjectLink
								link={{
									text: playlist.title,
									path: determineObjectPath("playlist", playlist.playlistID),
								}}
							/>
						),
					},
					content: onClose => (
						<ModalButtons>
							{hideInLibrary || (
								<ModalButton
									onClick={toggleInLibrary}
									icon={inLibrary ? "done" : "add"}
									text={inLibrary ? "Remove" : "Add"}
								/>
							)}
							<ModalButton
								icon="shuffle"
								text="Shuffle"
								onClick={shufflePlaylist}
							/>
							{userID === playlist.user.userID && (
								<Fragment>
									<ModalButton
										icon="edit"
										text="Rename"
										onClick={handleRenameModalOpen(onClose)}
									/>
									<ModalButton
										icon="delete"
										text="Delete"
										onClick={deletePlaylist}
									/>
								</Fragment>
							)}
						</ModalButtons>
					),
				}}
			/>
			<Modal
				open={renameModal}
				className="Padding"
				onClose={handleRenameModalClose}
			>
				<h1 className="HeadingFive MarginBottom">
					Rename
				</h1>
				<TextField
					name="Title"
					value={renameTitle}
					placeholder="Title"
					className="MarginBottom"
					fieldID="addToPlaylistTitle"
					onChange={handleTitleRenameChange}
				/>
				<div className="FlexRowGapHalf">
					<Button
						icon="edit"
						text="Rename"
						onClick={handleTitleRenameSubmit}
					/>
					<Button
						transparent
						icon="close"
						text="Close"
						onClick={handleRenameModalClose}
					/>
				</div>
			</Modal>
		</Fragment>
	)
}

interface PropTypes extends ClassNameBEMPropTypes, OnClickPropTypes {
	leftIcon?: boolean,
	hideModal?: boolean,
	playlist: PlaylistType,
	hideInLibrary?: boolean,
}

export default Playlist