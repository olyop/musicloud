import Button from "@oly_op/react-button";
import { Head } from "@oly_op/react-head";
import { FC, Fragment, createElement, useState } from "react";
import { useNavigate } from "react-router-dom";

import Buttons from "../../../components/buttons";
import Modal, { ModalButton, ModalButtons, ModalHeader } from "../../../components/modal";
import { useClearCache, useMutation } from "../../../hooks";
import ADD_CATALOG_TO_LIBRARY from "./add-catalog-to-library.gql";
import DELETE_LIBRARY from "./delete-library.gql";

const LibrarySettings: FC = () => {
	const navigate = useNavigate();
	const clearCache = useClearCache();

	const [deleteLibraryModal, setDeleteLibraryModal] = useState(false);

	const [deleteLibrary, { loading: deleteLibraryLoading }] = useMutation(DELETE_LIBRARY, {
		fetchPolicy: "no-cache",
	});

	const [addCatalogToLibrary, { loading: addCatalogToLibraryLoading }] = useMutation(
		ADD_CATALOG_TO_LIBRARY,
		{
			fetchPolicy: "no-cache",
		},
	);

	const handleDeleteLibraryModalOpen = () => setDeleteLibraryModal(true);
	const handleDeleteLibraryModalClose = () => setDeleteLibraryModal(false);

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
			<div className="PaddingBottom Content">
				<h2 className="HeadingFive MarginBottomHalf">Settings</h2>
				<Buttons>
					<Button icon="delete" text="Delete Library" onClick={handleDeleteLibraryModalOpen} />
					<Button
						icon="add"
						text="Add Catalog to Library"
						onClick={handleAddCatalogToLibraryClick}
					/>
				</Buttons>
			</div>
			<Modal open={deleteLibraryModal} onClose={handleDeleteLibraryModalClose}>
				<ModalButtons>
					<ModalHeader
						hideShare
						text={<Fragment>Are you sure you want to delete your library?</Fragment>}
					/>
					<ModalButton text="Delete" icon="delete" onClick={handleDeleteLibraryClick} />
					<ModalButton text="Cancel" icon="arrow_back" onClick={handleDeleteLibraryModalClose} />
				</ModalButtons>
			</Modal>
		</Head>
	);
};

export default LibrarySettings;
