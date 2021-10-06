import { createElement, FC } from "react"
import { createBEM, BEMPropTypes } from "@oly_op/bem"

import { useStateListStyle } from "../../redux"
import { SettingsListStyle } from "../../types"

import "./index.scss"

const bem =
	createBEM("List")

const List: FC<PropTypes> = ({
	children,
	className,
	alwaysList = false,
}) => {
	const listStyle = useStateListStyle()
	const isGrid = alwaysList ? false : (listStyle === SettingsListStyle.GRID)
	return (
		<div className={bem(className, isGrid && "")}>
			{children}
		</div>
	)
}

interface PropTypes extends BEMPropTypes {
	alwaysList?: boolean,
}

export default List