import {
	HeadConfiguration,
	HeadOnPageTitleChange,
	defaultParseTitleFunction,
	HeadProvider as HeadBaseProvider,
} from "@oly_op/react-head";

import { createElement, FC, PropsWithChildren } from "react";
import { TITLE } from "@oly_op/musicloud-common/build/metadata";

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
