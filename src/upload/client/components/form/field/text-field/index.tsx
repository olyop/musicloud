import {
	VFC,
	useState,
	ChangeEvent,
	createElement,
	InputHTMLAttributes,
} from "react"

import { createBEM, BEMInput } from "@oly_op/bem"

import "./index.scss"

const bem =
	createBEM("TextField")

const TextField: VFC<TextFieldPropTypes> = ({
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
				id={fieldID}
				name={fieldID}
				onChange={onChange}
				className={bem("input")}
				onBlur={handleInputBlur}
				onFocus={handleInputFocus}
				placeholder={focus ? undefined : placeholder}
				style={{ borderRadius: focus ? "10rem" : undefined }}
				{...inputPropTypes}
			/>
		</div>
	)
}

type InputPropTypes =
	Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "onChange">

export interface TextFieldPropTypes extends InputPropTypes {
	key: string,
	name: string,
	fieldID: string,
	className?: BEMInput,
	onChange: (event: ChangeEvent<HTMLInputElement>) => void,
}

export default TextField