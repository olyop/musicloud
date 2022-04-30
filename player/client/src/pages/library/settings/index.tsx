import Button from "@oly_op/react-button"
import { Metadata } from "@oly_op/react-metadata"
import { createElement, FC, Fragment, useState, useEffect } from "react"

import Modal, {
	ModalButton,
	ModalHeader,
	ModalButtons,
} from "../../../components/modal"

import { useMutation } from "../../../hooks"
import DELETE_LIBRARY from "./delete-library.gql"

const LibrarySettings: FC = () => {
	const [ deleteLibraryModal, setDeleteLibraryModal ] =
		useState(false)

	const [ deleteLibrary, { data: deleteLibraryData } ] =
		useMutation(DELETE_LIBRARY)

	const handleDeleteLibraryModalOpen =
		() => setDeleteLibraryModal(true)

	const handleDeleteLibraryModalClose =
		() => setDeleteLibraryModal(false)

	const handleDeleteLibrary =
		() => {
			handleDeleteLibraryModalClose()
			void deleteLibrary()
		}

	useEffect(() => {
		if (deleteLibraryData) {
			location.reload()
		}
	}, [deleteLibraryData])

	return (
		<Metadata title="Library Settings">
			<div className="PaddingBottom Content BodyTwo">
				<h2 className="HeadingFive MarginBottomHalf">
					Settings
				</h2>
				<Button
					icon="delete"
					text="Delete Library"
					onClick={handleDeleteLibraryModalOpen}
				/>
			</div>
			<Modal open={deleteLibraryModal} onClose={handleDeleteLibraryModalClose}>
				<ModalButtons>
					<ModalHeader
						hideShare
						text={(
							<Fragment>
								Are you sure you want
								to delete your library?
							</Fragment>
						)}
					/>
					<ModalButton
						text="Delete"
						icon="delete"
						onClick={handleDeleteLibrary}
					/>
					<ModalButton
						text="Cancel"
						icon="arrow_back"
						onClick={handleDeleteLibraryModalClose}
					/>
				</ModalButtons>
			</Modal>
		</Metadata>
	)
}

export default LibrarySettings