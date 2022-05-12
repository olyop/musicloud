import { BEMInput, createBEM } from "@oly_op/bem"
import { Head, HeadPageTitleOptions } from "@oly_op/react-head"
import { createElement, FC, ReactElement, ReactNode, useEffect } from "react"

import "./index.scss"

const bem =
	createBEM("Page")

const headerBaseClassName =
	"Elevated PaddingLeft PaddingRightHalf PaddingBottomHalf"

const Page: FC<PropTypes> = ({
	header,
	content,
	pageTitle,
	headerClassName,
	contentClassName,
}) => {
	useEffect(() => {
		const pageElement = document.querySelector<HTMLDivElement>(".Page")
		if (pageElement && !header) {
			pageElement.style.setProperty("--page-header-height", "0%")
		}
	}, [])
	return (
		<Head pageTitle={pageTitle}>
			<div className={bem("")}>
				{header && (
					<div
						children={header}
						className={bem(headerClassName, "header", headerBaseClassName)}
					/>
				)}
				<div
					children={content}
					className={bem(contentClassName, "content")}
				/>
			</div>
		</Head>
	)
}

interface PropTypes extends HeadPageTitleOptions {
	content: ReactNode,
	header?: ReactElement,
	headerClassName?: BEMInput,
	contentClassName?: BEMInput,
}

export default Page