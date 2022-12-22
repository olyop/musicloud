import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { Head } from "@oly_op/react-head";
import inRange from "lodash-es/inRange";
import { FC, Fragment, createElement } from "react";
import { NavLink, Route, Routes } from "react-router-dom";

import Window from "../../components/window";
import Navigation from "../../layouts/navigation";
import Page from "../../layouts/page";
import CreatePlaylistButton from "./create-playlist-button";
import "./index.scss";
import routes from "./routes";
import ShuffleButton from "./shuffle-button";

const bem = createBEM("Library");

const Header: FC = () => (
	<Navigation
		routes={routes}
		linkClassName={bem("header-link")}
		right={
			<Fragment>
				<NavLink to="settings">
					{({ isActive }) => (
						<Button icon="settings" transparent={!isActive} title="Library Settings" />
					)}
				</NavLink>
				<Window>
					{({ width }) => {
						const hideButtonText = inRange(width, 0, 575) || inRange(width, 800, 950);
						return (
							<Fragment>
								<CreatePlaylistButton hideButtonText={hideButtonText} />
								<ShuffleButton hideButtonText={hideButtonText} />
							</Fragment>
						);
					}}
				</Window>
			</Fragment>
		}
	/>
);

const Library: FC = () => (
	<Head pageTitle="Library">
		<Page
			header={<Header />}
			headerClassName={bem("header")}
			childrenClassName="PaddingTopBottom"
			children={
				<Routes>
					{routes.map(({ routeID, path, element }) => (
						<Route path={path} key={routeID} element={element} />
					))}
				</Routes>
			}
		/>
	</Head>
);

export default Library;
