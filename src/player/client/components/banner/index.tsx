import Image from "@oly_op/react-image"
import { createBEM } from "@oly_op/bem"
import { createElement, FC, ReactNode } from "react"

import "./index.scss"

const bem =
	createBEM("Banner")

const Banner: FC<PropTypes> = ({
	title,
	buttons,
	content,
	subTitle,
	children,
	coverURL,
	profileURL,
}) => (
	<Image
		url={coverURL}
		imgClassName={bem("img")}
		className={bem("", "Elevated")}
	>
		<div className={bem("content", "Content PaddingBottomOneHalf")}>
			<Image
				url={profileURL}
				className={bem("content-profile", "Elevated")}
			/>
			<div className="OverflowHidden">
				<h1 className={bem("content-title", "HeadingTwoInverted")}>
					{title}
				</h1>
				{subTitle && (
					<p className="HeadingSixInverted MarginTopHalf">
						{subTitle}
					</p>
				)}
				{content}
				{buttons && (
					<div className={bem("content-buttons", "MarginTop FlexListGapHalf")}>
						{buttons}
					</div>
				)}
			</div>
		</div>
		<div
			className={bem("black")}
		/>
	</Image>
)

interface PropTypes {
	title: ReactNode,
	coverURL: string,
	profileURL: string,
	content?: ReactNode,
	buttons?: ReactNode,
	subTitle?: ReactNode,
}

export default Banner