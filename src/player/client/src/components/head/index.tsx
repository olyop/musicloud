import {
	HeadConfiguration,
	HeadOnPageTitleChange,
	HeadProvider,
	defaultParseTitleFunction,
} from "@oly_op/react-head"

import { TITLE } from "@oly_op/musicloud-common"
import { createElement, FC, PropsWithChildren } from "react"

import { updatePageTitle, useDispatch } from "../../redux"

const Head: FC<PropsWithChildren> = ({ children }) => {
	const dispatch = useDispatch()

	const handlePageTitleChange: HeadOnPageTitleChange =
		({ pageTitle }) => {
			dispatch(updatePageTitle(pageTitle))
		}

	const configuration: HeadConfiguration = {
		title: TITLE,
		description: TITLE,
		parseTitle: defaultParseTitleFunction,
		onPageTitleChange: handlePageTitleChange,
	}

	return (
		<HeadProvider configuration={configuration}>
			{children}
		</HeadProvider>
	)
}

export default Head