import uniqueID from "lodash/uniqueId"
import Button from "@oly_op/react-button"
import Metadata from "@oly_op/react-metadata"
import { useApolloClient } from "@apollo/client"
import { createElement, FC, Fragment, useState } from "react"

import {
	addLoading,
	removeLoading,
	useDispatch,
	useStateLoading,
} from "../../../redux"

import Modal, {
	ModalButton,
	ModalHeader,
	ModalButtons,
} from "../../../components/modal"

import { User } from "../../../types"
import { useMutation } from "../../../hooks"
import DELETE_LIBRARY from "./delete-library.gql"
import GET_LIBRARY_SONGS from "./get-library-songs.gql"
import { determineCatalogMP3URL } from "../../../helpers"

const downloadLibraryLoadingID =
	uniqueID()

interface SongsData {
	user: User,
}

const LibrarySettings: FC = () => {
	const dispatch = useDispatch()
	const client = useApolloClient()
	const loading = useStateLoading()

	const [ deleteLibraryModal, setDeleteLibraryModal ] =
		useState(false)

	const [ downloadLibraryModal, setDownloadLibraryModal ] =
		useState(false)

	const [ deleteLibrary ] =
		useMutation(DELETE_LIBRARY)

	const isLibraryDownloading =
		loading.includes(downloadLibraryLoadingID)

	const handleDeleteLibraryModalOpen =
		() => setDeleteLibraryModal(true)

	const handleDeleteLibraryModalClose =
		() => setDeleteLibraryModal(false)

	const handleDownloadLibraryModalOpen =
		() => setDownloadLibraryModal(true)

	const handleDownloadLibraryModalClose =
		() => setDownloadLibraryModal(false)

	const handleDeleteLibrary =
		async () => {
			handleDeleteLibraryModalClose()
			await deleteLibrary()
			location.reload()
		}

	const handleDownloadLibrary =
		async () => {
			if (!isLibraryDownloading) {
				dispatch(addLoading(downloadLibraryLoadingID))

				const { data } =
					await client.query<SongsData>({
						query: GET_LIBRARY_SONGS,
					})

				const { librarySongs } =
					data.user

				for (const { songID } of librarySongs) {
					await fetch(determineCatalogMP3URL(songID))
				}

				dispatch(removeLoading(downloadLibraryLoadingID))
				handleDownloadLibraryModalClose()
			}
		}

	return (
		<Metadata title="Library Settings">
			<div className="PaddingBottom Content BodyTwo">
				<h2 className="HeadingFive MarginBottomHalf">
					Settings
				</h2>
				<Button
					icon="cloud_download"
					className="MarginBottomHalf"
					onClick={handleDownloadLibraryModalOpen}
					text={isLibraryDownloading ? "Downloading..." : "Download Library"}
				/>
				<Button
					icon="delete"
					text="Delete Library"
					onClick={handleDeleteLibraryModalOpen}
				/>
			</div>
			{deleteLibraryModal && (
				<Modal onClose={handleDeleteLibraryModalClose}>
					<ModalButtons>
						<ModalHeader
							text={(
								<Fragment>
									<Fragment>Are you sure you want</Fragment>
									<br/>
									<Fragment>to delete your library?</Fragment>
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
			)}
			{downloadLibraryModal && (
				<Modal onClose={handleDownloadLibraryModalClose}>
					<ModalButtons>
						<ModalHeader
							text="Download Library"
						/>
						<ModalButton
							text="Download"
							icon="cloud_download"
							onClick={handleDownloadLibrary}
						/>
						<ModalButton
							text="Cancel"
							icon="arrow_back"
							onClick={handleDownloadLibraryModalClose}
						/>
					</ModalButtons>
				</Modal>
			)}
		</Metadata>
	)
}

export default LibrarySettings