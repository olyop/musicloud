import Button from "@oly_op/react-button"
import { createElement, Fragment, useState, VFC } from "react"
import { PlaylistPrivacy } from "@oly_op/music-app-common/types"

import { Playlist } from "../../types"
import { useUpdatePlaylistPrivacy } from "../../hooks"
import Modal, { ModalButton, ModalButtons, ModalHeader } from "../../components/modal"

// const determinePrivacyIcon =
// 	(privacy: PlaylistPrivacy) => {
// 		switch (privacy) {
// 			case PlaylistPrivacy.PUBLIC:
// 				return "public"
// 			case PlaylistPrivacy.PRIVATE:
// 				return "lock"
// 			case PlaylistPrivacy.FRIENDS:
// 				return "people"
// 			default:
// 				return undefined
// 		}
// 	}

const PlaylistPagePrivacyButton: VFC<PropTypes> = ({ playlist }) => {
	const [ modal, setModal ] =
		useState(false)

	const [ updatePlaylistPrivacy ] =
		useUpdatePlaylistPrivacy(playlist)

	const handleModalClose =
		() => setModal(false)

	const handleModalOpen =
		() => setModal(true)

	const handlePublicClick =
		async () => {
			await updatePlaylistPrivacy(PlaylistPrivacy.PUBLIC)
		}

	const handlePrivateClick =
		async () => {
			await updatePlaylistPrivacy(PlaylistPrivacy.PRIVATE)
		}

	const handleFriendsClick =
		async () => {
			await updatePlaylistPrivacy(PlaylistPrivacy.FRIENDS)
		}

	return (
		<Fragment>
			<Button
				text="Privacy"
				icon="security"
				onClick={handleModalOpen}
			/>
			<Modal open={modal} onClose={handleModalClose}>
				{onClose => (
					<Fragment>
						<ModalHeader
							text="Change playlist privacy"
						/>
						<ModalButtons>
							<ModalButton
								icon="public"
								text="Public"
								onClose={handleModalClose}
								onClick={handlePublicClick}
							/>
							<ModalButton
								icon="people"
								text="Friends"
								onClose={handleModalClose}
								onClick={handleFriendsClick}
							/>
							<ModalButton
								icon="lock"
								text="Private"
								onClose={handleModalClose}
								onClick={handlePrivateClick}
							/>
							<ModalButton
								icon="close"
								text="Cancel"
								onClick={onClose}
							/>
						</ModalButtons>
					</Fragment>
				)}
			</Modal>
		</Fragment>
	)
}

interface PropTypes {
	playlist: Playlist,
}

export default PlaylistPagePrivacyButton