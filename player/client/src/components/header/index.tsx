import { createElement, FC } from "react"

import PageTitle from "./page-title"
import MenuButton from "./menu-button"
import SearchButton from "./search-button"
import OfflineButton from "./offline-button"
import AccountButton from "./account-button"
// import DownloadsMenu from "./downloads-menu"

import "./index.scss"

const Header: FC = () => (
	<header className="Header BorderBottom FlexRowSpaceBetween">
		<div className="FlexRowGapHalf">
			<MenuButton/>
			<PageTitle/>
		</div>
		<div className="FlexRowGapQuart PaddingRightHalf">
			<div className="FlexRow">
				<SearchButton/>
				{/* <DownloadsMenu/> */}
			</div>
			<OfflineButton/>
			<AccountButton/>
		</div>
	</header>
)

export default Header