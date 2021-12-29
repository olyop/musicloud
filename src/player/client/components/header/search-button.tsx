import Button from "@oly_op/react-button"
import { createElement, VFC } from "react"
import { useLocation, NavLink } from "react-router-dom"

const HeaderSearchButton: VFC = () => {
	const { pathname } = useLocation()
	return (
		<NavLink to="/search">
			<Button
				icon="search"
				title="Search"
				transparent={pathname !== "/search"}
			/>
		</NavLink>
	)
}

export default HeaderSearchButton