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
	<div className={bem("", "Elevated")}>
		<div
			className={bem("shade", "FullWidthAndHeight")}
		/>
		<div
			style={{ backgroundImage: `url("${coverURL}")` }}
			className={bem("background", "FullWidthAndHeight")}
		/>
		<div className={bem("content", "Content PaddingBottom")}>
			<img
				alt="Profile"
				src={profileURL}
				crossOrigin="anonymous"
				className={bem("content-profile", "Elevated")}
			/>
			<div className={bem("FlexColumnGap")}>
				<h1 className={bem("content-title", "HeadingTwoInverted")}>
					{title}
				</h1>
				<div className="FlexColumnGapHalf">
					{subTitle && (
						<p className="HeadingSixInverted">
							{subTitle}
						</p>
					)}
					{content}
				</div>
				{buttons && (
					<div className={bem("content-buttons", "FlexRowGapHalf")}>
						{buttons}
					</div>
				)}
			</div>
		</div>
	</div>
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