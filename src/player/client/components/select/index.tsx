import { createBEM } from "@oly_op/bem"
import startCase from "lodash-es/startCase"
import { createElement, VFC, ChangeEventHandler, SelectHTMLAttributes } from "react"

import { ClassNameBEMPropTypes, HandlerReturn } from "../../types"

import "./index.scss"

const bem =
	createBEM("Select")

const Select: VFC<PropTypes> = ({
	value,
	options,
	onChange,
	tabIndex,
	className,
}) => {
	const handleChange: ChangeEventHandler<HTMLSelectElement> =
		async event => onChange(event.target.value)
	return (
		<select
			value={value}
			tabIndex={tabIndex}
			onChange={handleChange}
			className={bem(className, "", "BodyTwo Border Rounded PaddingFifth")}
		>
			{options.map(
				option => (
					<option
						key={option}
						value={option}
						children={startCase(option.toLowerCase())}
					/>
				),
			)}
		</select>
	)
}

export type SelectOnChange =
	(value: string) => HandlerReturn

interface PropTypes
	extends
	ClassNameBEMPropTypes,
	Pick<SelectHTMLAttributes<HTMLSelectElement>, "tabIndex"> {
	value: string,
	options: string[],
	onChange: SelectOnChange,
}

export default Select