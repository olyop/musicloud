import { createBEM } from "@oly_op/bem"
import { Head } from "@oly_op/react-head"
import Button from "@oly_op/react-button"
import { Route, Routes, NavLink } from "react-router-dom"
import { useState, createElement, FC, Fragment } from "react"

import routes from "./routes"
import Page from "../../components/page"
import Modal from "../../components/modal"
import Window from "../../components/window"
import Navigation from "../../components/navigation"
import LibraryCreatePlaylist from "./create-playlist"
import { useMutation, useResetPlayer } from "../../hooks"

import SHUFFLE_LIBRARY from "./shuffle-library.gql"

import "./index.scss"
import { updatePlay, useDispatch } from "../../redux"

const bem =
	createBEM("Library")

const Library: FC = () => {
	const dispatch = useDispatch()
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
			dispatch(updatePlay(true))
		}

	return (
		<Head pageTitle="Library">
			<Page
				headerClassName={bem("header")}
				childrenClassName="PaddingTopBottom"
				header={(
					<Navigation
						routes={routes}
						linkClassName={bem("header-link")}
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
											<Modal
												className="Padding"
												open={createPlaylistModal}
												onClose={handleCreatePlaylistModalClose}
												children={(
													<LibraryCreatePlaylist
														onClose={handleCreatePlaylistModalClose}
													/>
												)}
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
				)}
				children={(
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
				)}
			/>
		</Head>
	)
}

export default Library