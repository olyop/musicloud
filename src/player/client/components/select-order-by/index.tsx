import { createElement, VFC } from "react"
import { createBEM, BEMPropTypes } from "@oly_op/bem"

import Select from "../select"
import { OrderBy, SettingsOrderBy, OrderByDirection, OrderByOptions } from "../../types"
import { useDispatch, updateOrderBy, useStateOrderBy } from "../../redux"

import "./index.scss"

const bem =
	createBEM("SelectOrderBy")

const SelectOrderBy: VFC<PropTypes> = ({ orderBy, className }) => {
	const dispatch = useDispatch()
	const state = useStateOrderBy(orderBy.key)

	const handleChange =
		(key: keyof OrderBy) =>
			(value: string) => {
				dispatch(
					updateOrderBy({
						key,
						value,
						settingsKey: orderBy.key,
					}),
				)
			}

	return (
		<div className={bem(className, "")}>
			<Select
				value={state.field}
				options={orderBy.fields}
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
	orderBy: OrderByOptions<SettingsOrderBy>,
}

export default SelectOrderBy