import { createBEM } from "@oly_op/bem";
import { FC, createElement } from "react";
import { Link } from "react-router-dom";

import { ClassNameBEMPropTypes, OnClickPropTypes } from "../../types";
import "./index.scss";

const bem = createBEM("ObjectLink");

const ObjectLink: FC<PropTypes> = ({ link, onClick, className }) => (
	<Link
		to={link.path}
		title={link.text}
		onClick={onClick}
		children={link.text}
		className={bem(className, "")}
	/>
);

export interface ObjectLinkOptions {
	path: string;
	text: string;
}

interface PropTypes extends OnClickPropTypes, ClassNameBEMPropTypes {
	link: ObjectLinkOptions;
}

export default ObjectLink;
