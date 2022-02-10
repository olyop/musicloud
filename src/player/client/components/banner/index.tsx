import Image from "@oly_op/react-image"
import { createBEM } from "@oly_op/bem"
import { createElement, VFC, ReactNode } from "react"

import "./index.scss"

const bem =
	createBEM("Banner")

const Banner: VFC<PropTypes> = ({
	title,
	buttons,
	content,
	subTitle,
	coverURL,
	profileURL,
}) => (
	<Image
		url={coverURL}
		imgClassName={bem("img")}
		className={bem("", "Elevated")}
	>
		<div className={bem("content", "Content PaddingBottom")}>
			<img
				alt="Profile"
				src={profileURL}
				crossOrigin="anonymous"
				className={bem("content-profile", "Elevated")}
			/>
			<div>
				<h1 className={bem("content-title", "HeadingTwoInverted")}>
					{title}
				</h1>
				{subTitle && (
					<p className="HeadingSixInverted MarginTopHalf">
						{subTitle}
					</p>
				)}
				<div className="MarginTopHalf">
					{content}
				</div>
				{buttons && (
					<div className={bem("content-buttons", "MarginTop FlexRowGapHalf")}>
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