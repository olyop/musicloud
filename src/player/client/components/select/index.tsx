import { startCase } from "lodash-es"
import { createBEM } from "@oly_op/bem"
import { createElement, ReactElement, ChangeEventHandler } from "react"

import { ClassNameBEMPropTypes, HandlerReturn } from "../../types"

import "./index.scss"

const bem =
	createBEM("Select")

// eslint-disable-next-line @typescript-eslint/comma-dangle
const Select = <T,>({
	value,
	options,
	onChange,
	className,
}: PropTypes<T>): ReactElement => {
	const handleChange: ChangeEventHandler<HTMLSelectElement> =
		async event =>
			onChange(event.target.value as unknown as T)
	return (
		<select
			value={value}
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

interface PropTypes<T> extends ClassNameBEMPropTypes {
	value: string,
	options: string[],
	onChange: (value: T) => HandlerReturn,
}

export default Select