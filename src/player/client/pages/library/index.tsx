import Button from "@oly_op/react-button"
import { useState, createElement, VFC, Fragment } from "react"
import { useLocation, Route, Routes, NavLink } from "react-router-dom"

import routes from "./routes"
import Window from "../../components/window"
import SHUFFLE_LIBRARY from "./shuffle-library.gql"
import Navigation from "../../components/navigation"
import LibraryCreatePlaylist from "./create-playlist"
import { useDispatch, updatePlay } from "../../redux"
import { useMutation, useResetPlayer } from "../../hooks"
import Modal, { ModalButton, ModalButtons } from "../../components/modal"

const LibrarySettings: VFC = () => {
	const location = useLocation()
	return (
		<NavLink to="settings">
			<Button
				icon="settings"
				title="Library Settings"
				transparent={location.pathname !== "/library/settings"}
			/>
		</NavLink>
	)
}

const Library: VFC = () => {
	const dispatch = useDispatch()
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
		async () => {
			handleModalsClose()
			resetPlayer()
			await libraryShuffle()
			dispatch(updatePlay(true))
		}

	return (
		<section className="PaddingTopBottom">
			<h1 className="HeadingThree Content MarginBottomHalf">
				Library
			</h1>
			<Navigation
				routes={routes}
				className="MarginBottom"
				right={(
					<Fragment>
						<LibrarySettings/>
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
						text="Library Shuffle"
						onClick={handleLibraryShuffle}
					/>
					<ModalButton
						icon="psychology"
						text="Smart Shuffle"
					/>
					<ModalButton
						icon="handyman"
						text="Custom Shuffle"
						link="/custom-shuffle"
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