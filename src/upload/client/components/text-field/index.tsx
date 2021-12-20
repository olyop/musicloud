import {
	VFC,
	useState,
	useEffect,
	createElement,
	InputHTMLAttributes,
	ChangeEventHandler,
} from "react"

import isEmpty from "lodash/isEmpty"
import Image from "@oly_op/react-image"
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
		useState<string | undefined>(undefined)

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
				<Image
					url={imageURL}
					className={bem("image", `image-${imageOrientation}`)}
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
	Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "list" | "className">

export interface TextFieldPropTypes extends InputPropTypes {
	type: string,
	image?: File,
	list?: Item[],
	value?: string,
	className?: BEMInput,
	onItemAdd?: (value: string) => () => void,
	imageOrientation?: "portrait" | "landscape",
	onItemRemove?: (index: number) => () => void,
}

export default TextField