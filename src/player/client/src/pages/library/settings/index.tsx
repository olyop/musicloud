import Button from "@oly_op/react-button";
import { Head } from "@oly_op/react-head";
import { FC, Fragment, createElement, useState } from "react";
import { useNavigate } from "react-router-dom";

import Buttons from "../../../components/buttons";
import Modal, { ModalButton, ModalButtons, ModalHeader } from "../../../components/modal";
import { determinePlural } from "../../../helpers";
import { useClearCache, useMutation, useQuery } from "../../../hooks";
import ADD_CATALOG_TO_LIBRARY from "./add-catalog-to-library.gql";
import DELETE_LIBRARY from "./delete-library.gql";
import GET_LIBRARY_TOTALS from "./get-library-totals.gql";

const LibrarySettings: FC = () => {
	const navigate = useNavigate();
	const clearCache = useClearCache();

	const [deleteLibraryModal, setDeleteLibraryModal] = useState(false);

	const { data } = useQuery<Data>(GET_LIBRARY_TOTALS);

	const [deleteLibrary, { loading: deleteLibraryLoading }] = useMutation(DELETE_LIBRARY, {
		fetchPolicy: "no-cache",
	});

	const [addCatalogToLibrary, { loading: addCatalogToLibraryLoading }] = useMutation(
		ADD_CATALOG_TO_LIBRARY,
		{
			fetchPolicy: "no-cache",
		},
	);

	const handleDeleteLibraryModalOpen = () => {
		setDeleteLibraryModal(true);
	};

	const handleDeleteLibraryModalClose = () => {
		setDeleteLibraryModal(false);
	};

	const handleDeleteLibrary = async () => {
		await clearCache();
		await deleteLibrary();
		navigate("/");
	};

	const handleAddCatalogToLibrary = async () => {
		await clearCache();
		await addCatalogToLibrary();
		navigate("/library");
	};

	const handleDeleteLibraryClick = () => {
		if (!deleteLibraryLoading) {
			handleDeleteLibraryModalClose();
			void handleDeleteLibrary();
		}
	};

	const handleAddCatalogToLibraryClick = () => {
		if (!addCatalogToLibraryLoading) {
			void handleAddCatalogToLibrary();
		}
	};

	return (
		<Head pageTitle="Library Settings">
			<div className="PaddingBottom FlexColumnGap Content">
				<h2 className="HeadingFive">Settings</h2>
				<Buttons>
					<Button icon="delete" text="Delete Library" onClick={handleDeleteLibraryModalOpen} />
					<Modal open={deleteLibraryModal} onClose={handleDeleteLibraryModalClose}>
						<ModalButtons>
							<ModalHeader
								hideShare
								text={<Fragment>Are you sure you want to delete your library?</Fragment>}
							/>
							<ModalButton text="Delete" icon="delete" onClick={handleDeleteLibraryClick} />
							<ModalButton
								text="Cancel"
								icon="arrow_back"
								onClick={handleDeleteLibraryModalClose}
							/>
						</ModalButtons>
					</Modal>
					<Button
						icon="add"
						text="Add Catalog to Library"
						onClick={handleAddCatalogToLibraryClick}
					/>
				</Buttons>
				{data && (
					<div className="FlexColumnGapQuart">
						<p className="ParagraphOne">
							{data.getLibrary.songsTotal} song{determinePlural(data.getLibrary.songsTotal)}
						</p>
						<p className="ParagraphOne">
							{data.getLibrary.genresTotal} genre{determinePlural(data.getLibrary.genresTotal)}
						</p>
						<p className="ParagraphOne">
							{data.getLibrary.albumsTotal} album{determinePlural(data.getLibrary.albumsTotal)}
						</p>
						<p className="ParagraphOne">
							{data.getLibrary.playlistsTotal} playlist
							{determinePlural(data.getLibrary.playlistsTotal)}
						</p>
					</div>
				)}
			</div>
		</Head>
	);
};

interface Data {
	getLibrary: {
		songsTotal: number;
		albumsTotal: number;
		genresTotal: number;
		artistsTotal: number;
		playlistsTotal: number;
	};
}

export default LibrarySettings;
