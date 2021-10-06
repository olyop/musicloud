import {
	FC,
	useState,
	createElement,
	ChangeEventHandler,
	InputHTMLAttributes,
} from "react"

import { createBEM , BEMPropTypes } from "@oly_op/bem"

import "./index.scss"

const bem =
	createBEM("TextField")

const TextField: FC<TextFieldPropTypes> = ({
	name,
	fieldID,
	onChange,
	className,
	placeholder,
	...inputPropTypes
}) => {
	const [ hover, setHover ] = useState(false)
	const [ focus, setFocus ] = useState(false)

	const handleRootHover =
		() => setHover(prevState => !prevState)

	const handleInputFocus =
		() => setFocus(true)

	const handleInputBlur =
		() => setFocus(false)

	const handleInputChange: ChangeEventHandler<HTMLInputElement> =
		event => onChange(event.target.value)

	return (
		<div
			className={bem(className, "")}
			onMouseEnter={handleRootHover}
			onMouseLeave={handleRootHover}
		>
			<label
				children={name}
				htmlFor={fieldID}
				className={bem("label")}
				style={{
					color: hover || focus ? "var(--primary-color)" : undefined,
				}}
			/>
			<div
				className={bem("outline")}
				style={{
					opacity: hover || focus ? 1 : 0,
					borderRadius: focus ? "10rem" : undefined,
				}}
			/>
			<input
				name={name}
				id={fieldID}
				className={bem("input")}
				onBlur={handleInputBlur}
				onFocus={handleInputFocus}
				onChange={handleInputChange}
				placeholder={focus ? undefined : placeholder}
				style={{ borderRadius: focus ? "10rem" : undefined }}
				{...inputPropTypes}
			/>
		</div>
	)
}

type InputPropTypes =
	Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "onChange">

export interface TextFieldPropTypes extends BEMPropTypes, InputPropTypes {
	name: string,
	fieldID: string,
	onChange: (value: string) => void,
}

export default TextField