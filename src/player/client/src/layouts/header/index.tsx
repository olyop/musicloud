import { createBEM } from "@oly_op/bem";
import { createElement, FC } from "react";

import PageTitle from "./page-title";
import MenuButton from "./menu-button";
import SearchButton from "./search-button";
import OfflineButton from "./offline-button";
import AccountButton from "./account-button";
import DownloadsMenu from "./downloads-menu";

import "./index.scss";

const bem = createBEM("Header");

const Header: FC = () => (
	<header className={bem("", "BorderBottom FlexRowSpaceBetween")}>
		<div className={bem("left", "FlexRow")}>
			<MenuButton />
			<PageTitle />
		</div>
		<div className="FlexRowGapQuart PaddingRightHalf">
			<div className="FlexRow">
				<SearchButton />
				<DownloadsMenu />
			</div>
			<OfflineButton />
			<AccountButton />
		</div>
	</header>
);

export default Header;
