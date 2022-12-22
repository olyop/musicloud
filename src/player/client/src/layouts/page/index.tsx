import { BEMInput, createBEM } from "@oly_op/bem";
import { FC, ReactElement, ReactNode, createElement, useEffect } from "react";

import "./index.scss";

const bem = createBEM("Page");

const Page: FC<PropTypes> = ({ header, children, headerClassName, childrenClassName }) => {
	useEffect(() => {
		const pageElement = document.querySelector<HTMLDivElement>(".Page");
		if (pageElement && !header) {
			pageElement.style.setProperty("--content-height", "100%");
		}
	}, []);
	return (
		<main className={bem("")}>
			{header && (
				<div className={bem(headerClassName, "header", "PaddingHalf BorderBottom")}>{header}</div>
			)}
			{children && <div className={bem(childrenClassName, "content")}>{children}</div>}
		</main>
	);
};

interface PropTypes {
	children?: ReactNode;
	header?: ReactElement;
	headerClassName?: BEMInput;
	childrenClassName?: BEMInput;
}

export { PropTypes as PagePropTypes };

export default Page;
