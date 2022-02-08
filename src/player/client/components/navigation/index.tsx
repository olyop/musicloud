import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { NavLink } from "react-router-dom"
import { createElement, ReactNode, VFC } from "react"

import { ClassNamePropTypes, Route } from "../../types"

import "./index.scss"

const bem =
	createBEM("Navigation")

const Navigation: VFC<PropTypes> = ({
	right,
	routes,
	className,
}) => (
	<nav className={bem(className, "", "Content FlexRowSpaceBetween")}>
		<div className={bem("links", "FlexRowGapHalf")}>
			{routes.map(({
				icon,
				path,
				name,
				ignore,
				routeID,
				underline = true,
			}) => (
				ignore || (
					<NavLink
						to={path}
						key={routeID}
						className={
							({ isActive }) => (
								bem(
									isActive && (
										underline ?
											"active" : "active-no-underline"
									),
									"link",
								)!
							)
						}
						children={(
							<Button
								icon={icon}
								text={name}
								transparent
								className={bem("link-button")}
								iconClassName={bem("link-button-icon")}
								textClassName={bem("link-button-text")}
							/>
						)}
					/>
				)
			))}
		</div>
		{right && (
			<div
				children={right}
				className="FlexRowGapHalf"
			/>
		)}
	</nav>
)

interface PropTypes extends ClassNamePropTypes {
	routes: Route[],
	right?: ReactNode,
}

export default Navigation