import { isEmpty } from "lodash-es"
import { createBEM } from "@oly_op/bem"
import { createElement, FC, Fragment } from "react"
import { ChildrenProps } from "@oly_op/musicloud-common"

import { useStateLoading } from "../../redux"

import "./index.scss"

const bem =
	createBEM("Loading")

const Loading: FC<ChildrenProps> = ({ children }) => {
	const loading = useStateLoading()
	return (
		<Fragment>
			{children}
			{isEmpty(loading) || (
				<div className={bem("")}>
					<div className={bem("line")}/>
					<div className={bem("subline", "asc")}/>
					<div className={bem("subline", "desc")}/>
				</div>
			)}
		</Fragment>
	)
}

export default Loading