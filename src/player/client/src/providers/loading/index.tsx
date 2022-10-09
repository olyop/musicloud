import isEmpty from "lodash-es/isEmpty";
import { createBEM } from "@oly_op/bem";
import { createElement, FC, Fragment, PropsWithChildren } from "react";

import { useStateLoading } from "../../redux";

import "./index.scss";

const bem = createBEM("Loading");

export const LoadingProvider: FC<PropsWithChildren> = ({ children }) => {
	const loading = useStateLoading();
	return (
		<Fragment>
			{isEmpty(loading) || (
				<div className={bem("")}>
					<div className={bem("line")} />
					<div className={bem("subline", "asc")} />
					<div className={bem("subline", "desc")} />
				</div>
			)}
			{children}
		</Fragment>
	);
};
