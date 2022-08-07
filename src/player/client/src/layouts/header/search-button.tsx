import { createElement, FC } from "react"
import Button from "@oly_op/react-button"
import { NavLink } from "react-router-dom"

const SearchButton: FC = () => (
	<NavLink to="/search">
		{({ isActive }) => (
			<Button
				icon="search"
				title="Search"
				transparent={!isActive}
			/>
		)}
	</NavLink>
)

export default SearchButton