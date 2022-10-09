import { createElement, FC } from "react";

import { useStatePageTitle } from "../../redux";

const PageTitle: FC = () => {
	const pageTitle = useStatePageTitle();
	return <h1 className="Header__left-title ParagraphOne">{pageTitle}</h1>;
};

export default PageTitle;
