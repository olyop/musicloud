import Button from "@oly_op/react-button"
import { createElement, Fragment, useState, VFC } from "react"

import { Playlist } from "../../types"
import { useTogglePlaylistPublic } from "../../hooks"
import Modal, { ModalButton, ModalButtons, ModalHeader } from "../../components/modal"

const PlaylistPageIsPublicButton: VFC<PropTypes> = ({ playlist }) => {
	const [ modal, setModal ] =
		useState(false)

	const [ togglePlaylistPublic ] =
		useTogglePlaylistPublic(playlist)

	const handleModalClose =
		() => setModal(false)

	const handleModalOpen =
		() => setModal(true)

	return (
		<Fragment>
			<Button
				onClick={handleModalOpen}
				icon={playlist.isPublic ? "public" : "lock"}
				text={playlist.isPublic ? "Public" : "Private"}
				title={`Make ${playlist.isPublic ? "Private" : "Public"}`}
			/>
			<Modal open={modal} onClose={handleModalClose}>
				{onClose => (
					<Fragment>
						<ModalHeader
							text="Are you sure?"
						/>
						<ModalButtons>
							<ModalButton
								onClose={handleModalClose}
								onClick={togglePlaylistPublic}
								icon={playlist.isPublic ? "lock" : "public"}
								text={`Make ${playlist.isPublic ? "Private" : "Public"}`}
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

export default PlaylistPageIsPublicButton