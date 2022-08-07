import Button from "@oly_op/react-button"
import { useNavigate } from "react-router-dom"
import { PlaylistID } from "@oly_op/musicloud-common/build/types"
import { createElement, Fragment, useEffect, useState, FC } from "react"

import Modal, { ModalButton, ModalButtons, ModalHeader } from "../../components/modal"

import { useDeletePlaylist } from "../../hooks"

const PlaylistPageDeleteButton: FC<PlaylistID> = ({ playlistID }) => {
	const navigate = useNavigate()
	const [ modal, setModal ] = useState(false)

	const [ deletePlaylist, { data } ] =
		useDeletePlaylist({ playlistID })

	const handleModalOpen =
		() => setModal(true)

	const handleModalClose =
		() => setModal(false)

	const handleDeletePlaylist =
		() => {
			void deletePlaylist()
		}

	useEffect(() => {
		if (data) {
			navigate(-1)
		}
	}, [data])

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