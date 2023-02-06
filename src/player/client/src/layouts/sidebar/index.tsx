import { createBEM } from "@oly_op/bem";
import { determineServiceURL } from "@oly_op/musicloud-common/build/determine-service-url";
import { ServicesNames } from "@oly_op/musicloud-common/build/types";
import Button from "@oly_op/react-button";
import { FC, Fragment, createElement } from "react";
import { NavLink } from "react-router-dom";

import { toggleSidebar, useDispatch, useStateAccessToken, useStateSidebar } from "../../redux";
import "./index.scss";

const bem = createBEM("Sidebar");

const Sidebar: FC = () => {
	const dispatch = useDispatch();
	const sidebar = useStateSidebar();
	const accessToken = useStateAccessToken();

	const handleClose = () => {
		dispatch(toggleSidebar());
	};

	return sidebar ? (
		<div className={bem("")}>
			<div aria-hidden onClick={handleClose} className={bem("background")} />
			<nav className={bem("content", "Elevated PaddingBottom")}>
				<div>
					<div className={bem("content-header", "FlexRow")}>
						<Button
							transparent
							icon="close"
							text="Close"
							onClick={handleClose}
							className={bem("content-header-close")}
							textClassName={bem("content-header-close-text")}
						/>
					</div>
					<div className={bem("links", "BorderTop")}>
						<div className={bem("links-group")}>
							<NavLink
								to="/"
								title="Browse"
								onClick={handleClose}
								children={({ isActive }) => (
									<Button
										icon="home"
										text="Browse"
										transparent={!isActive}
										className={bem("route-button")}
									/>
								)}
							/>
							<NavLink
								title="Top #100"
								onClick={handleClose}
								to="/top-one-hundred-songs"
								children={({ isActive }) => (
									<Button
										icon="list"
										text="Top #100"
										transparent={!isActive}
										className={bem("route-button-sub", "route-button")}
									/>
								)}
							/>
						</div>
						<div className={bem("links-group")}>
							<NavLink
								end
								to="/library"
								title="Library"
								onClick={handleClose}
								children={({ isActive }) => (
									<Button
										text="Library"
										icon="library_music"
										transparent={!isActive}
										className={bem("route-button")}
									/>
								)}
							/>
							<NavLink
								to="/library/songs"
								title="Library Songs"
								onClick={handleClose}
								children={({ isActive }) => (
									<Button
										text="Songs"
										icon="audiotrack"
										transparent={!isActive}
										className={bem("route-button-sub", "route-button")}
									/>
								)}
							/>
							<NavLink
								to="/library/albums"
								onClick={handleClose}
								title="Library Albums"
								children={({ isActive }) => (
									<Button
										icon="album"
										text="Albums"
										transparent={!isActive}
										className={bem("route-button-sub", "route-button")}
									/>
								)}
							/>
							<NavLink
								onClick={handleClose}
								to="/library/genres"
								title="Library Genres"
								children={({ isActive }) => (
									<Button
										icon="list"
										text="Genres"
										transparent={!isActive}
										className={bem("route-button-sub", "route-button")}
									/>
								)}
							/>
							<NavLink
								to="/library/artists"
								onClick={handleClose}
								title="Library Artists"
								children={({ isActive }) => (
									<Button
										icon="person"
										text="Artists"
										transparent={!isActive}
										className={bem("route-button-sub", "route-button")}
									/>
								)}
							/>
							<NavLink
								onClick={handleClose}
								to="/library/playlists"
								title="Library Playlists"
								children={({ isActive }) => (
									<Button
										text="Playlists"
										icon="queue_music"
										transparent={!isActive}
										className={bem("route-button-sub", "route-button")}
									/>
								)}
							/>
						</div>
						<div className={bem("links-group")}>
							<a
								title="About"
								target="_blank"
								rel="noreferrer"
								onClick={handleClose}
								href="https://olyop.com/projects"
								children={
									<Button
										transparent
										icon="info"
										text="About"
										rightIcon="open_in_new"
										className={bem("route-button")}
										rightIconClassName={bem("route-button-icon-right")}
									/>
								}
							/>
						</div>
						{accessToken && (
							<div className={bem("links-group")}>
								<a
									title="Upload"
									target="_blank"
									rel="noreferrer"
									onClick={handleClose}
									className="BorderBottom PaddingTopBottomHalf"
									href={determineServiceURL({ accessToken, service: ServicesNames.UPLOADER })}
									children={
										<Button
											transparent
											icon="upload"
											text="Upload"
											rightIcon="open_in_new"
											className={bem("route-button")}
											rightIconClassName={bem("route-button-icon-right")}
										/>
									}
								/>
							</div>
						)}
					</div>
				</div>
				<a
					target="_blank"
					rel="noreferrer"
					title="Source Code"
					href="https://github.com/olyop/music-app"
					className="ParagraphOne PaddingLeftRight Link"
					children={
						<Fragment>
							<Fragment>v</Fragment>
							{VERSION}
						</Fragment>
					}
				/>
			</nav>
		</div>
	) : null;
};

export default Sidebar;
