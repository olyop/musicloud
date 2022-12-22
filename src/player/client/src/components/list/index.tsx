import { createBEM } from "@oly_op/bem";
import { FC, PropsWithChildren, createElement } from "react";

import { useStateListStyle } from "../../redux";
import { ClassNameBEMPropTypes, SettingsListStyle } from "../../types";
import "./index.scss";

const bem = createBEM("List");

const List: FC<PropsWithChildren<PropTypes>> = ({ children, className, alwaysList = false }) => {
	const listStyle = useStateListStyle();
	const isGrid = alwaysList ? false : listStyle === SettingsListStyle.GRID;
	return <div className={bem(className, isGrid && "")}>{children}</div>;
};

interface PropTypes extends ClassNameBEMPropTypes {
	alwaysList?: boolean;
}

export default List;
