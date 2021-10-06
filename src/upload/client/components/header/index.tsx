import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { createElement, FC } from "react"
import { useLocation, useHistory } from "react-router-dom"

import "./index.scss"

const bem =
	createBEM("Header")

const Header: FC = () => {
	const history = useHistory()
	const { pathname } = useLocation()

	const handleRouteChange =
		(path: string) =>
			() => history.push(path)

	return (
		<div className={bem("", "Elevated")}>
			<Button
				text="User"
				transparent
				icon="person"
				onClick={handleRouteChange("/user")}
				className={bem(
					pathname === "/user" && "button-active",
					"button",
				)}
			/>
			<Button
				transparent
				icon="person"
				text="Artist"
				onClick={handleRouteChange("/artist")}
				className={bem(
					pathname === "/artist" && "button-active",
					"button",
				)}
			/>
			<Button
				transparent
				icon="list"
				text="Genre"
				onClick={handleRouteChange("/genre")}
				className={bem(
					pathname === "/genre" && "button-active",
					"button",
				)}
			/>
			<Button
				transparent
				icon="album"
				text="Album"
				onClick={handleRouteChange("/album")}
				className={bem(
					pathname === "/album" && "button-active",
					"button",
				)}
			/>
		</div>
	)
}

export default Header