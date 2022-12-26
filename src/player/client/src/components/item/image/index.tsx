import { createBEM } from "@oly_op/bem";
import { FC, Fragment, createElement } from "react";
import { Link } from "react-router-dom";

import { ClassNameBEMPropTypes } from "../../../types";
import { ImageOptions } from "../types";
import "./index.scss";

const bem = createBEM("ItemImage");

const ItemImage: FC<PropTypes> = ({ options, className }) => (
	<Fragment>
		{options.path ? (
			<Link
				to={options.path}
				title={options.title}
				className={bem(className, "link")}
				children={
					<img
						src={options.url}
						crossOrigin="anonymous"
						alt={options.title}
						className={bem("", "Card")}
					/>
				}
			/>
		) : (
			<img
				src={options.url}
				crossOrigin="anonymous"
				alt={options.title}
				className={bem(className, "link", "img", "Card")}
			/>
		)}
	</Fragment>
);

interface PropTypes extends ClassNameBEMPropTypes {
	options: ImageOptions;
}

export default ItemImage;
