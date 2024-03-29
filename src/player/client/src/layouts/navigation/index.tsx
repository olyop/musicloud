import { BEMInput, createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { FC, ReactNode, createElement } from "react";
import { NavLink } from "react-router-dom";

import Window from "../../components/window";
import { ClassNameBEMPropTypes, ClassNamePropTypes, RouteObjectCustom } from "../../types";
import "./index.scss";

const bem = createBEM("Navigation");

const NavigationLink: FC<LinkPropTypes> = ({
	className,
	route: { end, icon, path, name, underline = true },
}) => (
	<NavLink
		to={path}
		end={end}
		className={({ isActive }) => bem(className, underline && isActive && "link-active", "link")}
	>
		{({ isActive }) => (
			<Window>
				{({ width }) => (
					<Button
						icon={icon}
						transparent
						className={bem("link-button")}
						text={width > 800 ? name : undefined}
						iconClassName={bem("link-button-icon")}
						childrenClassName={bem(isActive || "link-button-children")}
					/>
				)}
			</Window>
		)}
	</NavLink>
);

interface LinkPropTypes extends ClassNameBEMPropTypes {
	route: RouteObjectCustom;
}

const Navigation: FC<PropTypes> = ({ right, routes, className, linkClassName }) => (
	<nav className={bem(className, "", "FlexRowSpaceBetween")}>
		<div className="FlexRowGapHalf">
			<div className={bem("links", "FlexRow")}>
				{routes.map(
					route =>
						route.ignore || (
							<NavigationLink route={route} key={route.routeID} className={linkClassName} />
						),
				)}
			</div>
		</div>
		{right && <div children={right} className="FlexRowGapHalf" />}
	</nav>
);

interface PropTypes extends ClassNamePropTypes {
	routes: RouteObjectCustom[];
	right?: ReactNode;
	linkClassName?: BEMInput;
}

export default Navigation;
