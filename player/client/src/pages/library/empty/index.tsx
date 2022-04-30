import { Link } from "react-router-dom"
import { createBEM } from "@oly_op/bem"
import { createElement, FC, Fragment, ReactNode } from "react"

import "./index.scss"

const bem =
	createBEM("LibraryEmpty")

const LibraryEmpty: FC<PropTypes> = ({ name, content }) => (
	<div className="Content PaddingBottom FlexColumnGapHalf">
		<h2 className={bem("heading")}>
			<Fragment>No </Fragment>
			{name}
			<Fragment>.</Fragment>
		</h2>
		<h3 className={bem("text")}>
			<Link
				to="/"
				children="Browse"
				className={bem("link")}
			/>
			<Fragment> or </Fragment>
			<Link
				children="search"
				to="/search?query="
				className={bem("link")}
			/>
			<Fragment> to add music.</Fragment>
		</h3>
		{content}
	</div>
)

interface PropTypes {
	name: string,
	content?: ReactNode,
}

export default LibraryEmpty