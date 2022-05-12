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
	innerClassName,
}) => (
	<nav className={bem(className, "")}>
		<div className={bem(innerClassName, "FlexRowSpaceBetween")}>
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
		</div>
	</nav>
)

interface PropTypes extends ClassNamePropTypes {
	routes: Route[],
	right?: ReactNode,
	innerClassName?: BEMInput,
}

export default Navigation