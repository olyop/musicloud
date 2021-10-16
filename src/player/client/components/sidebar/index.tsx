import { createBEM } from "@oly_op/bem"
import { createElement, FC, Fragment } from "react"
import Button from "@oly_op/react-button"
import { NavLink } from "react-router-dom"
import { VERSION } from "@oly_op/music-app-common/globals"

import {
	useDispatch,
	toggleSidebar,
	useStateSidebar,
} from "../../redux"

import "./index.scss"

const HOST = process.env.HOST!
const UPLOAD_PORT = parseInt(process.env.UPLOAD_CLIENT_PORT!)
const ADD_URL = `http://${HOST}:${UPLOAD_PORT}/artist`

const bem =
	createBEM("Sidebar")

const Sidebar: FC = () => {
	const dispatch = useDispatch()
	const sidebar = useStateSidebar()

	const handleClose =
		() => {
			dispatch(toggleSidebar())
		}

	return sidebar ? (
		<div className={bem("")}>
			<div
				onClick={handleClose}
				className={bem("background", "FullWidthAndHeight")}
			/>
			<nav className={bem("content", "Elevated PaddingBottom")}>
				<div>
					<div className={bem("content-header", "FlexList PaddingLeftRightHalf")}>
						<Button
							icon="close"
							transparent
							title="Close"
							onClick={handleClose}
						/>
					</div>
					<div className={bem("links", "BorderBottom PaddingBottomHalf")}>
						<NavLink
							to="/"
							title="Browse"
							onClick={handleClose}
							className={bem("route", "BorderTop PaddingTopHalf")}
						>
							<Button
								transparent
								icon="home"
								text="Browse"
								className={bem("route-button", "PaddingLeft")}
							/>
						</NavLink>
						<NavLink
							title="Top 100"
							onClick={handleClose}
							to="/top-one-hundred-songs"
							className={bem("route")}
						>
							<Button
								transparent
								icon="list"
								text="Top 100"
								className={bem("route-button", "PaddingLeftDouble")}
							/>
						</NavLink>
						<NavLink
							to="/library"
							title="Library"
							onClick={handleClose}
							className={bem("route", "BorderTop MarginTopHalf PaddingTopHalf")}
						>
							<Button
								transparent
								text="Library"
								icon="library_music"
								className={bem("route-button", "PaddingLeft")}
							/>
						</NavLink>
						<NavLink
							to="/library/songs"
							title="Library Songs"
							onClick={handleClose}
							className={bem("route")}
						>
							<Button
								transparent
								text="Songs"
								icon="audiotrack"
								className={bem("route-button", "PaddingLeftDouble")}
							/>
						</NavLink>
						<NavLink
							to="/library/artists"
							onClick={handleClose}
							title="Library Artists"
							className={bem("route")}
						>
							<Button
								transparent
								icon="person"
								text="Artists"
								className={bem("route-button", "PaddingLeftDouble")}
							/>
						</NavLink>
						<NavLink
							onClick={handleClose}
							to="/library/playlists"
							title="Library Playlists"
							className={bem("route")}
						>
							<Button
								transparent
								text="Playlists"
								icon="queue_music"
								className={bem("route-button", "PaddingLeftDouble")}
							/>
						</NavLink>
						<NavLink
							onClick={handleClose}
							to="/library/settings"
							title="Library Settings"
							className={bem("route")}
						>
							<Button
								transparent
								icon="settings"
								text="Settings"
								className={bem("route-button", "PaddingLeftDouble")}
							/>
						</NavLink>
					</div>
				</div>
				<p className="BodyOne PaddingLeftRight">
					v
					{VERSION}
					<Fragment> - </Fragment>
					<a
						title="Add"
						href={ADD_URL}
						children="Add"
					/>
				</p>
			</nav>
		</div>
	) : null
}

export default Sidebar