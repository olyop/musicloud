import Button from "@oly_op/react-button"
import { Head } from "@oly_op/react-head"
import { createElement, FC, Fragment, useState, useEffect } from "react"

import Modal, {
	ModalButton,
	ModalHeader,
	ModalButtons,
} from "../../../components/modal"

import { useMutation } from "../../../hooks"

import DELETE_LIBRARY from "./delete-library.gql"
import Buttons from "../../../components/buttons"
import ADD_CATALOG_TO_LIBRARY from "./add-catalog-to-library.gql"

const LibrarySettings: FC = () => {
	const [ deleteLibraryModal, setDeleteLibraryModal ] =
		useState(false)

	const [ deleteLibrary, { data: deleteLibraryData } ] =
		useMutation(DELETE_LIBRARY)

	const [ addCatalogToLibrary ] =
		useMutation(ADD_CATALOG_TO_LIBRARY)

	const handleDeleteLibraryModalOpen =
		() => setDeleteLibraryModal(true)

	const handleDeleteLibraryModalClose =
		() => setDeleteLibraryModal(false)

	const handleDeleteLibrary =
		() => {
			handleDeleteLibraryModalClose()
			void deleteLibrary()
		}

	const handleCatalogToLibrary =
		() => {
			void addCatalogToLibrary()
		}

	useEffect(() => {
		if (deleteLibraryData) {
			location.reload()
		}
	}, [deleteLibraryData])

	return (
		<Head pageTitle="Library Settings">
			<div className="PaddingBottom Content">
				<h2 className="HeadingFive MarginBottomHalf">
					Settings
				</h2>
				<Buttons>
					<Button
						icon="delete"
						text="Delete Library"
						onClick={handleDeleteLibraryModalOpen}
					/>
					<Button
						icon="add"
						text="Add Catalog to Library"
						onClick={handleCatalogToLibrary}
					/>
				</Buttons>
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
		</Head>
	)
}

export default LibrarySettings