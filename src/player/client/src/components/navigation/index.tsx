import Button from "@oly_op/react-button"
import { NavLink } from "react-router-dom"
import { BEMInput, createBEM } from "@oly_op/bem"
import { createElement, ReactNode, FC } from "react"

import { ClassNamePropTypes, Route } from "../../types"

import "./index.scss"

const bem =
	createBEM("Navigation")

const Navigation: FC<PropTypes> = ({
	right,
	routes,
	className,
	linkClassName,
}) => (
	<nav className={bem(className, "", "FlexRowSpaceBetween")}>
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
									linkClassName,
									isActive && (
										underline ?
											"active" :
											"active-no-underline"
									),
									"link",
								)
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
	linkClassName?: BEMInput,
}

export default Navigation