import {
	VFC,
	useState,
	useEffect,
	createElement,
	InputHTMLAttributes,
	ChangeEventHandler,
} from "react"

import isEmpty from "lodash-es/isEmpty"
import Button from "@oly_op/react-button"
import { createBEM, BEMInput } from "@oly_op/bem"

import { Item } from "../../types"

import "./index.scss"

const bem =
	createBEM("TextField")

const TextField: VFC<TextFieldPropTypes> = ({
	id,
	type,
	name,
	list,
	image,
	value,
	action,
	onChange,
	className,
	onItemAdd,
	placeholder,
	onItemRemove,
	imageOrientation = "portrait",
	...inputPropTypes
}) => {
	const [ hover, setHover ] = useState(false)
	const [ focus, setFocus ] = useState(false)
	const [ privateValue, setPrivateValue ] = useState(value || "")

	const [ imageURL, setImageURL ] =
		useState<string | null>(null)

	const handleInputFocus =
		() => setFocus(true)

	const handleInputBlur =
		() => setFocus(false)

	const handleRootHover =
		() => setHover(prevState => !prevState)

	const borderRadius =
		focus ? undefined : "10rem"

	const handleOnChange: ChangeEventHandler<HTMLInputElement> =
		event => {
			setPrivateValue(event.target.value)
			if (onChange) {
				onChange(event)
			}
		}

	const handleItemAdd =
		() => {
			if (onItemAdd && !isEmpty(privateValue)) {
				onItemAdd(privateValue)()
				setPrivateValue("")
			}
		}

	useEffect(() => {
		let url: string
		if (image) {
			url = URL.createObjectURL(image)
			setImageURL(url)
		}
		return () => {
			if (image) {
				URL.revokeObjectURL(url)
			}
		}
	}, [image])

	return (
		<div
			className={bem(className, "")}
			onMouseEnter={handleRootHover}
			onMouseLeave={handleRootHover}
		>
			<label
				htmlFor={id}
				children={name}
				className={bem("label")}
				style={{
					color: hover || focus ? "var(--primary-color)" : undefined,
				}}
			/>
			<div
				className={bem("outline")}
				style={{
					opacity: hover || focus ? 1 : 0,
					borderRadius,
				}}
			/>
			{imageURL && (
				<img
					alt="temp"
					src={imageURL}
					className={bem("image", `image-${imageOrientation}`, "Elevated")}
				/>
			)}
			{list && !isEmpty(list) && (
				<div className={bem("list", "FlexRowGapHalf MarginBottomHalf")}>
					{list.map(
						item => (
							<div key={item.index} className="Elevated FlexRow Rounded PaddingQuart">
								<p className="BodyOne">
									{item.value}
								</p>
								<Button
									transparent
									icon="close"
									className={bem("list-close")}
									onClick={onItemRemove!(item.index)}
									iconClassName={bem("list-close-icon")}
								/>
							</div>
						),
					)}
				</div>
			)}
			<input
				id={id}
				name={id}
				type={type}
				autoComplete="nope"
				value={privateValue}
				style={{ borderRadius }}
				onBlur={handleInputBlur}
				onChange={handleOnChange}
				onFocus={handleInputFocus}
				placeholder={focus ? undefined : placeholder}
				className={bem(
					"input",
					list && "input-list-add",
					!isEmpty(list) && "input-list",
					imageURL && "input-image",
				)}
				{...inputPropTypes}
			/>
			{action && !action.disabled && (
				<a
					tabIndex={999}
					target="_blank"
					rel="noreferrer"
					href={action.url}
					title={action.title}
					className={bem("action")}
					children={(
						<Button
							transparent
							tabIndex={999}
							icon={action.icon}
							text={action.text}
						/>
					)}
				/>
			)}
			{list && (
				<Button
					icon="add"
					text="Add"
					transparent
					onClick={handleItemAdd}
					className={bem("list-add")}
				/>
			)}
		</div>
	)
}

type InputPropTypes =
	Omit<
		InputHTMLAttributes<HTMLInputElement>,
		"type" | "value" | "list" | "className"
	>

interface ActionOptions {
	url: string,
	icon: string,
	text: string,
	title?: string,
	disabled?: boolean,
}

export interface TextFieldPropTypes extends InputPropTypes {
	type: string,
	image?: File,
	list?: Item[],
	value?: string,
	className?: BEMInput,
	action?: ActionOptions,
	onItemAdd?: (value: string) => () => void,
	imageOrientation?: "portrait" | "landscape",
	onItemRemove?: (index: number) => () => void,
}

export default TextField