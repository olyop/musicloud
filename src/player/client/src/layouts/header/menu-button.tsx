import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, FC } from "react"

import { toggleSidebar, useDispatch } from "../../redux"

const bem =
	createBEM("Header")

const MenuButton: FC = () => {
	const dispatch = useDispatch()

	const handleMenuClick =
		() => {
			dispatch(toggleSidebar())
		}

	return (
		<Button
			icon="menu"
			transparent
			title="Menu"
			onClick={handleMenuClick}
			className={bem("left-icon", "icon")}
		/>
	)
}

export default MenuButton