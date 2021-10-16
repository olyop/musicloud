import Button from "@oly_op/react-button"
import { createBEM, BEMPropTypes } from "@oly_op/bem"
import { useState, createElement, FC, Fragment } from "react"

import {
	usePlayPlaylist,
	useRenamePlaylist,
	useDeletePlaylist,
	useToggleInLibrary,
} from "../../hooks"

import Item from "../item"
import Modal from "../modal"
import TextField from "../text-field"
import ObjectLink from "../object-link"
import { getUserID, determineObjectPath } from "../../helpers"
import { OnClickPropTypes, Playlist as PlaylistType } from "../../types"

const bem =
	createBEM("Playlist")

const Playlist: FC<PropTypes> = ({
	onClick,
	playlist,
	className,
	leftIcon = false,
	hideModal = false,
	hideInLibrary = false,
}) => {
	const [ renameModal, setRenameModal ] =
		useState(false)

	const [ renameTitle, setRenameTitle ] =
		useState("")

	const [ toggleInLibrary, inLibrary ] =
		useToggleInLibrary(playlist)

	const [ playPlaylist, isPlaying ] =
		usePlayPlaylist(playlist.playlistID)

	const [ renamePlaylist ] =
		useRenamePlaylist(playlist.playlistID)

	const [ deletePlaylist ] =
		useDeletePlaylist(playlist.playlistID)

	const handleRenameModalOpen =
		() => setRenameModal(true)

	const handleRenameModalClose =
		() => setRenameModal(false)

	const handleTitleRenameChange =
		(value: string) =>
			setRenameTitle(value)

	const handleTitleRenameSubmit =
		async () => {
			await renamePlaylist(renameTitle)
			handleRenameModalClose()
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
							text={playlist.title}
							path={determineObjectPath("playlist", playlist.playlistID)}
						/>
					),
					lowerLeft: (
						<ObjectLink
							text={playlist.user.name}
							path={determineObjectPath("user", playlist.user.userID)}
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
				modalHeader={{
					text: playlist.title,
				}}
				modalButtons={[
					...(hideModal ? [] : [{
						onClick: toggleInLibrary,
						icon: inLibrary ? "done" : "add",
						text: inLibrary ? "Remove" : "Add",
					}]),
					...(getUserID() === playlist.user.userID ? [{
						icon: "edit",
						text: "Rename",
						onClick: handleRenameModalOpen,
					},{
						icon: "delete",
						text: "Delete",
						onClick: deletePlaylist,
					}] : []),
					{
						icon: "info",
						text: "Info",
						link: determineObjectPath("playlist", playlist.playlistID),
					},
				]}
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
				<div className="FlexListGapHalf">
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

interface PropTypes extends BEMPropTypes, OnClickPropTypes {
	leftIcon?: boolean,
	hideModal?: boolean,
	playlist: PlaylistType,
	hideInLibrary?: boolean,
}

export default Playlist