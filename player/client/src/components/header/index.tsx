import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { NavLink } from "react-router-dom"
import { createElement, VFC } from "react"

import OfflineButton from "./offline-button"
import AccountButton from "./account-button"
import { useDispatch, toggleSidebar } from "../../redux"

import "./index.scss"

const bem =
	createBEM("Header")

const Header: VFC = () => {
	const dispatch = useDispatch()

	const handleMenuClick =
		() => {
			dispatch(toggleSidebar())
		}

	return (
		<header className={bem("", "Elevated FlexRowSpaceBetween")}>
			<Button
				icon="menu"
				transparent
				title="Menu"
				onClick={handleMenuClick}
				className={bem("left", "icon")}
			/>
			<div className="FlexRowGapQuart PaddingRightHalf">
				<NavLink to="/search">
					{({ isActive }) => (
						<Button
							icon="search"
							title="Search"
							transparent={!isActive}
						/>
					)}
				</NavLink>
				<OfflineButton/>
				<AccountButton/>
			</div>
		</header>
	)
}

export default Header