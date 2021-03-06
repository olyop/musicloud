import Button from "@oly_op/react-button"
import { PlaylistPrivacy } from "@oly_op/musicloud-common"
import { createElement, Fragment, useState, FC } from "react"

import { Playlist } from "../../types"
import { useUpdatePlaylistPrivacy } from "../../hooks"
import Modal, { ModalButton, ModalButtons, ModalHeader } from "../../components/modal"

const PlaylistPagePrivacyButton: FC<PropTypes> = ({ playlist }) => {
	const [ modal, setModal ] =
		useState(false)

	const [ updatePlaylistPrivacy ] =
		useUpdatePlaylistPrivacy(playlist)

	const handleModalClose =
		() => setModal(false)

	const handleModalOpen =
		() => setModal(true)

	const handleChange =
		(privacy: PlaylistPrivacy) =>
			() => updatePlaylistPrivacy(privacy)

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
							hideShare
							text="Change playlist privacy"
						/>
						<ModalButtons>
							{playlist.privacy === PlaylistPrivacy.PUBLIC || (
								<ModalButton
									icon="public"
									text="Public"
									onClose={onClose}
									onClick={handleChange(PlaylistPrivacy.PUBLIC)}
								/>
							)}
							{playlist.privacy === PlaylistPrivacy.FOLLOWERS || (
								<ModalButton
									icon="people"
									text="Followers"
									onClose={onClose}
									onClick={handleChange(PlaylistPrivacy.FOLLOWERS)}
								/>
							)}
							{playlist.privacy === PlaylistPrivacy.PRIVATE || (
								<ModalButton
									icon="lock"
									text="Private"
									onClose={onClose}
									onClick={handleChange(PlaylistPrivacy.PRIVATE)}
								/>
							)}
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