import Button from "@oly_op/react-button"
import { Route, Routes, NavLink } from "react-router-dom"
import { useState, createElement, VFC, Fragment } from "react"

import routes from "./routes"
import Modal from "../../components/modal"
import Window from "../../components/window"
import SHUFFLE_LIBRARY from "./shuffle-library.gql"
import Navigation from "../../components/navigation"
import LibraryCreatePlaylist from "./create-playlist"
import { useMutation, useResetPlayer } from "../../hooks"

const Library: VFC = () => {
	const resetPlayer = useResetPlayer()

	const [ createPlaylistModal, setCreatePlaylistModal ] =
		useState(false)

	const [ libraryShuffle ] =
		useMutation(SHUFFLE_LIBRARY)

	const handleCreatePlaylistModalOpen =
		() => setCreatePlaylistModal(true)

	const handleCreatePlaylistModalClose =
		() => setCreatePlaylistModal(false)

	const handleLibraryShuffle =
		() => {
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
										onClick={handleLibraryShuffle}
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
			<Modal
				className="Padding"
				open={createPlaylistModal}
				onClose={handleCreatePlaylistModalClose}
				children={<LibraryCreatePlaylist onClose={handleCreatePlaylistModalClose}/>}
			/>
		</section>
	)
}

export default Library