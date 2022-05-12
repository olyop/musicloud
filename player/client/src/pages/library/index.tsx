import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { Route, Routes, NavLink } from "react-router-dom"
import { useState, createElement, FC, Fragment } from "react"

import routes from "./routes"
import Page from "../../components/page"
import Modal from "../../components/modal"
import Window from "../../components/window"
import SHUFFLE_LIBRARY from "./shuffle-library.gql"
import Navigation from "../../components/navigation"
import LibraryCreatePlaylist from "./create-playlist"
import { useMutation, useResetPlayer } from "../../hooks"

import "./index.scss"

const bem =
	createBEM("Library")

const Library: FC = () => {
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
		<Page
			pageTitle="Library"
			headerClassName={bem("header")}
			contentClassName="PaddingTopBottom"
			header={(
				<Navigation
					routes={routes}
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
											children={<LibraryCreatePlaylist onClose={handleCreatePlaylistModalClose}/>}
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
			content={(
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
		// <section className={bem("", "FlexColumnHalf")}>
		// 	<Navigation
		// 		routes={routes}
		// 		innerClassName={bem("navigation-inner")}
		// 		className={bem("navigation", "PaddingBottomHalf Elevated")}
		// 		right={(
		// 			<Fragment>
		// 				<NavLink to="settings">
		// 					{({ isActive }) => (
		// 						<Button
		// 							icon="settings"
		// 							transparent={!isActive}
		// 							title="Library Settings"
		// 						/>
		// 					)}
		// 				</NavLink>
		// 				<Window>
		// 					{({ width }) => (
		// 						<Fragment>
		// 							<Button
		// 								icon="playlist_add"
		// 								title="Create Playlist"
		// 								onClick={handleCreatePlaylistModalOpen}
		// 								text={width > 1000 ? "Playlist" : undefined}
		// 							/>
		// 							<Modal
		// 								className="Padding"
		// 								open={createPlaylistModal}
		// 								onClose={handleCreatePlaylistModalClose}
		// 								children={<LibraryCreatePlaylist onClose={handleCreatePlaylistModalClose}/>}
		// 							/>
		// 							<Button
		// 								icon="shuffle"
		// 								title="Shuffle"
		// 								onClick={handleLibraryShuffle}
		// 								text={width > 1000 ? "Shuffle" : undefined}
		// 							/>
		// 						</Fragment>
		// 					)}
		// 				</Window>
		// 			</Fragment>
		// 		)}
		// 	/>
		// 	<div className={bem("content", "PaddingTopBottom")}>
		// 		<Routes>
		// 			{routes.map(
		// 				({ routeID, path, element }) => (
		// 					<Route
		// 						path={path}
		// 						key={routeID}
		// 						element={element}
		// 					/>
		// 				),
		// 			)}
		// 		</Routes>
		// 	</div>
		// </section>
	)
}

export default Library