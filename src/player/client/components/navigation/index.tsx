import Button from "@oly_op/react-button"
import { NavLink } from "react-router-dom"
import { createElement, FC, ReactNode } from "react"
import { createBEM, BEMPropTypes } from "@oly_op/bem"

import { Route } from "../../types"

import "./index.scss"

const bem =
	createBEM("Navigation")

const Navigation: FC<PropTypes> = ({
	right,
	routes,
	basePath,
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
						exact
						key={routeID}
						to={basePath + path}
						className={bem("link")}
						activeClassName={underline ?
							bem("active") : bem("active-no-underline")}
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
	basePath: string,
	right?: ReactNode,
}

export default Navigation