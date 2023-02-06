import { createBEM } from "@oly_op/bem";
import { FC, createElement } from "react";

import AccountButton from "./account-button";
import DownloadsMenu from "./downloads-menu";
import "./index.scss";
import MenuButton from "./menu-button";
import NavigationButtons from "./navigation-buttons";
import OfflineButton from "./offline-button";
import PageTitle from "./page-title";
import SearchButton from "./search-button";

const bem = createBEM("Header");

const Header: FC = () => (
	<header className={bem("", "BorderBottom FlexRowSpaceBetween")}>
		<div className={bem("left", "FlexRow")}>
			<MenuButton />
			<NavigationButtons />
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
