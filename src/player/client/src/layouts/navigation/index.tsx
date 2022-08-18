import Button from "@oly_op/react-button"
import { NavLink } from "react-router-dom"
import { BEMInput, createBEM } from "@oly_op/bem"
import { createElement, ReactNode, FC } from "react"

import Window from "../../components/window"
import { ClassNameBEMPropTypes, ClassNamePropTypes, Route } from "../../types"

import "./index.scss"

const bem =
	createBEM("Navigation")

const NavigationLink: FC<LinkPropTypes> = ({
	className,
	route: {
		icon,
		path,
		name,
		underline = true,
	},
}) => (
	<NavLink
		to={path}
		className={({ isActive }) => (
			bem(
				className,
				isActive && (
					underline ?
						"active" :
						"active-no-underline"
				),
				"link",
			)
		)}
	>
		<Window>
			{({ width }) => (
				<Button
					icon={icon}
					transparent
					className={bem("link-button")}
					text={width > 800 ? name : undefined}
					iconClassName={bem("link-button-icon")}
				/>
			)}
		</Window>
	</NavLink>
)

interface LinkPropTypes extends ClassNameBEMPropTypes {
	route: Route,
}

const Navigation: FC<PropTypes> = ({
	right,
	routes,
	className,
	linkClassName,
}) => (
	<nav className={bem(className, "", "FlexRowSpaceBetween")}>
		<div className="FlexRowGapHalf">
			<div className={bem("links", "FlexRow")}>
				{routes.map(route => (
					route.ignore || (
						<NavigationLink
							route={route}
							key={route.routeID}
							className={linkClassName}
						/>
					)
				))}
			</div>
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