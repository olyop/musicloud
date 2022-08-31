import Button from "@oly_op/react-button"
import { Head } from "@oly_op/react-head"
import { useNavigate } from "react-router-dom"
import { useApolloClient } from "@apollo/client"
import { createElement, FC, Fragment, useState } from "react"

import { useMutation } from "../../../hooks"
import { cachePersistor } from "../../../apollo"
import Buttons from "../../../components/buttons"
import Modal, { ModalButton, ModalHeader, ModalButtons } from "../../../components/modal"

import DELETE_LIBRARY from "./delete-library.gql"
import ADD_CATALOG_TO_LIBRARY from "./add-catalog-to-library.gql"

const LibrarySettings: FC = () => {
	const navigate = useNavigate()
	const client = useApolloClient()

	const [ deleteLibraryModal, setDeleteLibraryModal ] =
		useState(false)

	const [ deleteLibrary, { loading: deleteLibraryLoading } ] =
		useMutation(DELETE_LIBRARY)

	const [ addCatalogToLibrary, { loading: addCatalogToLibraryLoading } ] =
		useMutation(ADD_CATALOG_TO_LIBRARY, {
			fetchPolicy: "network-only",
		})

	const handleDeleteLibraryModalOpen =
		() => setDeleteLibraryModal(true)

	const handleDeleteLibraryModalClose =
		() => setDeleteLibraryModal(false)

	const handleDeleteLibrary =
		() => {
			if (!deleteLibraryLoading) {
				handleDeleteLibraryModalClose()
				cachePersistor.purge()
					.then(() => client.resetStore())
					.then(() => deleteLibrary())
					.then(() => navigate("/"))
					.catch(console.error)
			}
		}

	const handleCatalogToLibrary =
		() => {
			if (!addCatalogToLibraryLoading) {
				cachePersistor.purge()
					.then(() => client.resetStore())
					.then(() => addCatalogToLibrary())
					.then(() => navigate("/library"))
					.catch(console.error)
			}
		}

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