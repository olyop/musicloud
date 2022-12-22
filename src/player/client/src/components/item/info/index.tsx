import { createBEM } from "@oly_op/bem";
import { FC, createElement } from "react";

import { ClassNameBEMPropTypes } from "../../../types";
import { InfoOptions } from "../types";
import "./index.scss";

const bem = createBEM("ItemInfo");

const ItemInfo: FC<PropTypes> = ({ info, className, fadeInFromRight }) => (
	<div className={bem(className, fadeInFromRight && "fade-in", "")}>
		<div
			className={bem("left")}
			style={{
				justifyContent: info.lowerLeft ? undefined : "center",
			}}
		>
			<p children={info.upperLeft} className={bem("left-text", "ParagraphOneBold")} />
			{info.lowerLeft && (
				<p children={info.lowerLeft} className={bem("left-text", "ParagraphTwo OverflowHidden")} />
			)}
		</div>
		{(info.rightLeft || info.rightRight) && (
			<p className={bem("right", "ParagraphTwo LightColor")}>
				{info.rightLeft}
				{info.rightLeft && info.rightRight && <span className="MarginLeftRightQuart">&#8226;</span>}
				{info.rightRight}
			</p>
		)}
	</div>
);

interface PropTypes extends ClassNameBEMPropTypes {
	info: InfoOptions;
	fadeInFromRight: boolean;
}

export default ItemInfo;
