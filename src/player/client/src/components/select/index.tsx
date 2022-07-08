import { createBEM } from "@oly_op/bem"
import startCase from "lodash-es/startCase"
import { createElement, FC, ChangeEventHandler, SelectHTMLAttributes } from "react"

import { ClassNameBEMPropTypes } from "../../types"

import "./index.scss"

const bem =
	createBEM("Select")

const Select: FC<PropTypes> = ({
	value,
	options,
	onChange,
	tabIndex,
	className,
}) => {
	const handleChange: ChangeEventHandler<HTMLSelectElement> =
		event => { void onChange(event.target.value) }
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
	(value: string) => void

interface PropTypes
	extends
	ClassNameBEMPropTypes,
	Pick<SelectHTMLAttributes<HTMLSelectElement>, "tabIndex"> {
	value: string,
	options: string[],
	onChange: SelectOnChange,
}

export default Select