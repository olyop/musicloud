import { createBEM } from "@oly_op/bem"
import { Head } from "@oly_op/react-head"
import Button from "@oly_op/react-button"
import { Route, Routes, NavLink } from "react-router-dom"
import { useState, createElement, FC, Fragment } from "react"

import routes from "./routes"
import Page from "../../layouts/page"
import Modal from "../../components/modal"
import Window from "../../components/window"
import { QueueNowPlaying } from "../../types"
import Navigation from "../../layouts/navigation"
import { updatePlay, useDispatch } from "../../redux"
import LibraryCreatePlaylist from "./create-playlist"
import { useMutation, useResetPlayer } from "../../hooks"
import { updateNowPlayingMutationFunction } from "../../helpers"

import SHUFFLE_LIBRARY from "./shuffle-library.gql"

import "./index.scss"

const bem =
	createBEM("Library")

const Library: FC = () => {
	const dispatch = useDispatch()
	const resetPlayer = useResetPlayer()

	const [ createPlaylistModal, setCreatePlaylistModal ] =
		useState(false)

	const [ libraryShuffle ] =
		useMutation<ShuffleLibraryData>(SHUFFLE_LIBRARY, {
			update: updateNowPlayingMutationFunction(({ shuffleLibrary }) => shuffleLibrary.nowPlaying),
		})

	const handleCreatePlaylistModalOpen =
		() => setCreatePlaylistModal(true)

	const handleCreatePlaylistModalClose =
		() => setCreatePlaylistModal(false)

	const handleLibraryShuffle =
		() => {
			resetPlayer()
			void libraryShuffle().then(() => (
				dispatch(updatePlay(true))
			))
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
												text={width > 1100 ? "Playlist" : undefined}
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
												text={width > 1100 ? "Shuffle" : undefined}
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

interface ShuffleLibraryData {
	shuffleLibrary: QueueNowPlaying,
}

export default Library