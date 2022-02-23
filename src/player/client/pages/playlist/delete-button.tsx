import Button from "@oly_op/react-button"
import { useNavigate } from "react-router-dom"
import { PlaylistID } from "@oly_op/music-app-common/types"
import { createElement, Fragment, useState, VFC } from "react"

import Modal, { ModalButton, ModalButtons, ModalHeader } from "../../components/modal"

import { useDeletePlaylist } from "../../hooks"

const PlaylistPageDeleteButton: VFC<PlaylistID> = ({ playlistID }) => {
	const navigate = useNavigate()
	const [ modal, setModal ] = useState(false)

	const [ deletePlaylist ] =
		useDeletePlaylist({ playlistID })

	const handleModalOpen =
		() => setModal(true)

	const handleModalClose =
		() => setModal(false)

	const handleDeletePlaylist =
		async () => {
			await deletePlaylist()
			navigate(-1)
		}

	return (
		<Fragment>
			<Button
				icon="delete"
				text="Delete"
				onClick={handleModalOpen}
			/>
			<Modal open={modal} onClose={handleModalClose}>
				<ModalHeader
					hideShare
					text={(
						<Fragment>
							<Fragment>Are you sure you want</Fragment>
							<br/>
							<Fragment>to delete this playlist?</Fragment>
						</Fragment>
					)}
				/>
				<ModalButtons>
					<ModalButton
						text="Delete"
						icon="delete"
						onClose={handleModalClose}
						onClick={handleDeletePlaylist}
					/>
					<ModalButton
						text="Cancel"
						icon="arrow_back"
						onClick={handleModalClose}
					/>
				</ModalButtons>
			</Modal>
		</Fragment>
	)
}

export default PlaylistPageDeleteButton