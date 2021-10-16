import {
	Route,
	Switch,
	NavLink,
	useLocation,
	RouteComponentProps,
} from "react-router-dom"

import Button from "@oly_op/react-button"
import { useState, createElement, FC, Fragment } from "react"

import routes from "./routes"
import Window from "../../components/window"
import SHUFFLE_LIBRARY from "./shuffle-library.gql"
import Navigation from "../../components/navigation"
import LibraryCreatePlaylist from "./create-playlist"
import { useDispatch, updatePlay } from "../../redux"
import { useMutation, useResetPlayer } from "../../hooks"
import Modal, { ModalButton, ModalButtons } from "../../components/modal"

const Library: FC<RouteComponentProps> = ({ match }) => {
	const dispatch = useDispatch()
	const location = useLocation()
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
				basePath={match.path}
				className="MarginBottom"
				right={(
					<Fragment>
						<NavLink to={`${match.path}/settings`}>
							<Button
								icon="settings"
								title="Library Settings"
								transparent={location.pathname !== "/library/settings"}
							/>
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
			<Switch>
				{routes.map(
					({ routeID, exact, component, path }) => (
						<Route
							key={routeID}
							exact={exact}
							component={component}
							path={match.path + path}
						/>
					),
				)}
			</Switch>
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