import Button from "@oly_op/react-button"
import { Route, Routes, NavLink } from "react-router-dom"
import { useState, createElement, VFC, Fragment } from "react"

import routes from "./routes"
import Window from "../../components/window"
import SHUFFLE_LIBRARY from "./shuffle-library.gql"
import Navigation from "../../components/navigation"
import LibraryCreatePlaylist from "./create-playlist"
import { useMutation, useResetPlayer } from "../../hooks"
import Modal, { ModalButton, ModalButtons } from "../../components/modal"

const Library: VFC = () => {
	const resetPlayer = useResetPlayer()

	const [ modals, setModals ] =
		useState({
			shuffle: false,
			createPlaylist: false,
		})

	const [ libraryShuffle ] =
		useMutation(SHUFFLE_LIBRARY)

	const handleModalsClose =
		() =>
			setModals({
				shuffle: false,
				createPlaylist: false,
			})

	const handleShuffleModalOpen =
		() =>
			setModals({
				shuffle: true,
				createPlaylist: false,
			})

	const handleCreatePlaylistModalOpen =
		() =>
			setModals({
				shuffle: false,
				createPlaylist: true,
			})

	const handleLibraryShuffle =
		() => {
			handleModalsClose()
			resetPlayer()
			void libraryShuffle()
		}

	return (
		<section className="PaddingTopBottom">
			<h1 className="HeadingFour Content MarginBottomHalf">
				Library
			</h1>
			<Navigation
				routes={routes}
				className="MarginBottom"
				right={(
					<Fragment>
						<NavLink to="settings">
							{({ isActive }) => (
								<Button
									icon="settings"
									transparent={!isActive}
									title="Library Settings"
								/>
							)}
						</NavLink>
						<Window>
							{({ width }) => (
								<Fragment>
									<Button
										icon="playlist_add"
										title="Create Playlist"
										onClick={handleCreatePlaylistModalOpen}
										text={width > 1000 ? "Playlist" : undefined}
									/>
									<Button
										icon="shuffle"
										title="Shuffle"
										onClick={handleShuffleModalOpen}
										text={width > 1000 ? "Shuffle" : undefined}
									/>
								</Fragment>
							)}
						</Window>
					</Fragment>
				)}
			/>
			<Routes>
				{routes.map(
					({ routeID, path, element }) => (
						<Route
							path={path}
							key={routeID}
							element={element}
						/>
					),
				)}
			</Routes>
			<Modal open={modals.shuffle} onClose={handleModalsClose}>
				<ModalButtons>
					<ModalButton
						icon="list"
						text="Shuffle"
						onClick={handleLibraryShuffle}
					/>
					<ModalButton
						icon="handyman"
						text="Custom Shuffle"
						link="/custom-library-shuffle"
					/>
				</ModalButtons>
			</Modal>
			<Modal
				className="Padding"
				onClose={handleModalsClose}
				open={modals.createPlaylist}
			>
				<LibraryCreatePlaylist
					onClose={handleModalsClose}
				/>
			</Modal>
		</section>
	)
}

export default Library