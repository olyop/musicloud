import { createElement, FC } from "react"
import { createBEM, BEMPropTypes } from "@oly_op/bem"

import {
	useDispatch,
	updateOrderBy,
	useStateOrderBy,
} from "../../redux"

import {
	OrderBy,
	SettingsOrderBy,
	OrderByDirection,
} from "../../types"

import Select from "../select"

import "./index.scss"

const bem =
	createBEM("SelectOrderBy")

const SelectOrderBy: FC<PropTypes> = ({
	className,
	settingsKey,
	fieldOptions,
}) => {
	const dispatch = useDispatch()
	const state = useStateOrderBy(settingsKey)

	const handleChange =
		(key: keyof OrderBy) =>
			(value: string) => {
				dispatch(updateOrderBy({ key, value, settingsKey }))
			}

	return (
		<div className={bem(className, "")}>
			<Select
				value={state.field}
				options={fieldOptions}
				onChange={handleChange("field")}
			/>
			<Select
				className={bem("")}
				value={state.direction}
				onChange={handleChange("direction")}
				options={Object.keys(OrderByDirection)}
			/>
		</div>
	)
}

interface PropTypes extends BEMPropTypes {
	fieldOptions: string[],
	settingsKey: keyof SettingsOrderBy,
}

export default SelectOrderBy