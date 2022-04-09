import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { NavLink } from "react-router-dom"
import { createElement, VFC, Fragment } from "react"

import { useDispatch, toggleSidebar, useStateSidebar } from "../../redux"

import "./index.scss"

const bem =
	createBEM("Sidebar")

const Sidebar: VFC = () => {
	const dispatch = useDispatch()
	const sidebar = useStateSidebar()

	const handleClose =
		() => {
			dispatch(toggleSidebar())
		}

	return sidebar ? (
		<div className={bem("")}>
			<div
				aria-hidden
				onClick={handleClose}
				className={bem("background")}
			/>
			<nav className={bem("content", "Elevated PaddingBottom")}>
				<div>
					<div className={bem("content-header", "FlexRow")}>
						<Button
							icon="close"
							transparent
							text="Close"
							onClick={handleClose}
							className={bem("content-header-close")}
							textClassName={bem("content-header-close-text")}
						/>
					</div>
					<div className={bem("links", "PaddingBottomHalf")}>
						<NavLink
							to="/"
							title="Browse"
							onClick={handleClose}
							className={bem("route", "BorderTop PaddingTopHalf")}
							children={
								({ isActive }) => (
									<Button
										icon="home"
										text="Browse"
										transparent={!isActive}
										className={bem("route-button")}
									/>
								)
							}
						/>
						<NavLink
							title="Top 100"
							onClick={handleClose}
							className={bem("route")}
							to="/top-one-hundred-songs"
							children={
								({ isActive }) => (
									<Button
										icon="list"
										text="Top 100"
										transparent={!isActive}
										className={bem("route-button-sub", "route-button")}
									/>
								)
							}
						/>
						<NavLink
							to="/library"
							title="Library"
							onClick={handleClose}
							className={bem("route", "BorderTop MarginTopHalf PaddingTopHalf")}
							children={
								({ isActive }) => (
									<Button
										text="Library"
										icon="library_music"
										transparent={!isActive}
										className={bem("route-button")}
									/>
								)
							}
						/>
						<NavLink
							to="/library/songs"
							title="Library Songs"
							onClick={handleClose}
							className={bem("route")}
							children={
								({ isActive }) => (
									<Button
										text="Songs"
										icon="audiotrack"
										transparent={!isActive}
										className={bem("route-button-sub", "route-button")}
									/>
								)
							}
						/>
						<NavLink
							to="/library/albums"
							onClick={handleClose}
							title="Library Albums"
							className={bem("route")}
							children={
								({ isActive }) => (
									<Button
										icon="album"
										text="Albums"
										transparent={!isActive}
										className={bem("route-button-sub", "route-button")}
									/>
								)
							}
						/>
						<NavLink
							to="/library/artists"
							onClick={handleClose}
							title="Library Artists"
							className={bem("route")}
							children={
								({ isActive }) => (
									<Button
										icon="person"
										text="Artists"
										transparent={!isActive}
										className={bem("route-button-sub", "route-button")}
									/>
								)
							}
						/>
						<NavLink
							onClick={handleClose}
							to="/library/playlists"
							title="Library Playlists"
							className={bem("route")}
							children={
								({ isActive }) => (
									<Button
										text="Playlists"
										icon="queue_music"
										transparent={!isActive}
										className={bem("route-button-sub", "route-button")}
									/>
								)
							}
						/>
						<NavLink
							onClick={handleClose}
							to="/library/settings"
							title="Library Settings"
							className={bem("route", "BorderBottom PaddingBottomHalf")}
							children={
								({ isActive }) => (
									<Button
										icon="settings"
										text="Settings"
										transparent={!isActive}
										className={bem("route-button-sub", "route-button")}
									/>
								)
							}
						/>
						<a
							title="About"
							target="_blank"
							rel="noreferrer"
							onClick={handleClose}
							href="https://olyop.com/projects"
							className={bem("route", "BorderBottom PaddingTopBottomHalf")}
							children={(
								<Button
									transparent
									icon="info"
									text="About"
									className={bem("route-button")}
								/>
							)}
						/>
						{process.env.NODE_ENV === "development" && (
							<a
								title="Upload"
								onClick={handleClose}
								className={bem("route", "BorderBottom PaddingTopBottomHalf")}
								// eslint-disable-next-line max-len
								href={`http://${process.env.HOST === "0.0.0.0" ? "127.0.0.1" : process.env.HOST}:${process.env.UPLOAD_CLIENT_PORT}`}
								children={(
									<Button
										transparent
										icon="upload"
										text="Upload"
										className={bem("route-button")}
									/>
								)}
							/>
						)}
					</div>
				</div>
				<a
					target="_blank"
					rel="noreferrer"
					title="Source Code"
					className="BodyOne PaddingLeftRight"
					href="https://github.com/olyop/music-app"
					children={(
						<Fragment>
							<Fragment>Github v</Fragment>
							{VERSION}
						</Fragment>
					)}
				/>
			</nav>
		</div>
	) : null
}

export default Sidebar