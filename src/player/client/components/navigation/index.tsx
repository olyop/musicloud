import Button from "@oly_op/react-button"
import { NavLink } from "react-router-dom"
import { createBEM, BEMPropTypes } from "@oly_op/bem"
import { createElement, ReactNode, VFC } from "react"

import { Route } from "../../types"

import "./index.scss"

const bem =
	createBEM("Navigation")

const Navigation: VFC<PropTypes> = ({
	right,
	routes,
	className,
}) => (
	<nav className={bem(className, "Content FlexListSpaceBetween")}>
		<div className={bem("links", "FlexListGapHalf")}>
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
						className={({ isActive }) => (
							bem(
								isActive && (
									underline ?
										"active" : "active-no-underline"
								),
								"link",
							)!
						)}
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
				className="FlexListGapHalf"
			/>
		)}
	</nav>
)

interface PropTypes extends BEMPropTypes {
	routes: Route[],
	right?: ReactNode,
}

export default Navigation