import {
	FC,
	useState,
	useEffect,
	createElement,
	InputHTMLAttributes,
	ChangeEventHandler,
} from "react"

import isEmpty from "lodash/isEmpty"
import Image from "@oly_op/react-image"
import Button from "@oly_op/react-button"
import { createBEM , BEMPropTypes } from "@oly_op/bem"

import { Item } from "../../types"

import "./index.scss"

const bem =
	createBEM("TextField")

const TextField: FC<TextFieldPropTypes> = ({
	id,
	type,
	name,
	list,
	image,
	onChange,
	className,
	onItemAdd,
	placeholder,
	onItemRemove,
	imageOrientation = "portrait",
	...inputPropTypes
}) => {
	const [ value, setValue ] = useState("")
	const [ hover, setHover ] = useState(false)
	const [ focus, setFocus ] = useState(false)

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
			setValue(event.target.value)
			if (onChange) {
				onChange(event)
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
				<div className={bem("list", "FlexListGapHalf MarginBottomHalf")}>
					{list.map(
						item => (
							<div key={item.index} className="Elevated FlexList Rounded PaddingQuart">
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
					onClick={onItemAdd!(value)}
					className={bem("list-add")}
				/>
			)}
		</div>
	)
}

type InputPropTypes =
	Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "list" | "className">

export interface TextFieldPropTypes extends BEMPropTypes, InputPropTypes {
	type: string,
	image?: File,
	list?: Item[],
	onItemAdd?: (value: string) => () => void,
	imageOrientation?: "portrait" | "landscape",
	onItemRemove?: (index: number) => () => void,
}

export default TextField