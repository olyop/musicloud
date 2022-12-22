import { TITLE } from "@oly_op/musicloud-common/build/metadata";
import {
	HeadProvider as HeadBaseProvider,
	HeadConfiguration,
	HeadOnPageTitleChange,
	defaultParseTitleFunction,
} from "@oly_op/react-head";
import { FC, PropsWithChildren, createElement } from "react";

import { updatePageTitle, useDispatch } from "../redux";

export const HeadProvider: FC<PropsWithChildren> = ({ children }) => {
	const dispatch = useDispatch();

	const handlePageTitleChange: HeadOnPageTitleChange = ({ pageTitle }) => {
		dispatch(updatePageTitle(pageTitle));
	};

	const configuration: HeadConfiguration = {
		title: TITLE,
		description: TITLE,
		parseTitle: defaultParseTitleFunction,
		onPageTitleChange: handlePageTitleChange,
	};

	return <HeadBaseProvider configuration={configuration}>{children}</HeadBaseProvider>;
};
