import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { NavLink } from "react-router-dom"
import { createElement, VFC, useEffect } from "react"

import {
	useDispatch,
	toggleSidebar,
	updateIsOnline,
	useStateIsOnline,
} from "../../redux"

import checkOnlineStatus from "./check-online-status"
import HeaderAccountButton from "./account-button"

import "./index.scss"

const bem =
	createBEM("Header")

const Header: VFC = () => {
	const dispatch = useDispatch()
	const isOnline = useStateIsOnline()

	const checkStatus =
		async () =>
			dispatch(updateIsOnline(await checkOnlineStatus()))

	const handleMenuClick =
		() => {
			dispatch(toggleSidebar())
		}

	useEffect(() => {
		window.addEventListener("offline", () => {
			dispatch(updateIsOnline(false))
		})

		const id =
			setInterval(() => {
				void checkStatus()
			}, 20000)

		return () => {
			window.removeEventListener("offline", () => {
				dispatch(updateIsOnline(false))
			})
			clearInterval(id)
		}
	}, [])

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
				{isOnline || (
					<Button
						transparent
						title="Offline"
						icon="cloud_off"
						className={bem("offline")}
						iconTextClassName={bem("offline-span")}
					/>
				)}
				<HeaderAccountButton/>
			</div>
		</header>
	)
}

export default Header