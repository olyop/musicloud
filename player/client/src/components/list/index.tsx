import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"
import { ChildrenProps } from "@oly_op/musicloud-common"

import { useStateListStyle } from "../../redux"
import { ClassNameBEMPropTypes, SettingsListStyle } from "../../types"

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

interface PropTypes
	extends
	ChildrenProps,
	ClassNameBEMPropTypes {
	alwaysList?: boolean,
}

export default List