import { BEMInput, createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import isEmpty from "lodash-es/isEmpty";
import isNull from "lodash-es/isNull";
import isUndefined from "lodash-es/isUndefined";
import {
	ChangeEventHandler,
	FC,
	InputHTMLAttributes,
	createElement,
	useEffect,
	useState,
} from "react";

import { Item } from "../../types";
import "./index.scss";

const bem = createBEM("TextField");

const TextField: FC<PropTypes> = ({
	id,
	type,
	name,
	list,
	image,
	value,
	check,
	action,
	onChange,
	className,
	onItemAdd,
	placeholder,
	onItemRemove,
	imageOrientation = "portrait",
	...propTypes
}) => {
	const [hover, setHover] = useState(false);
	const [focus, setFocus] = useState(false);
	const [privateValue, setPrivateValue] = useState(isUndefined(value) ? "" : value);

	const [imageURL, setImageURL] = useState<string | null>(null);

	const handleInputFocus = () => setFocus(true);

	const handleInputBlur = () => setFocus(false);

	const handleRootHover = () => setHover(prevState => !prevState);

	const borderRadius = focus ? undefined : "10rem";

	const handleOnChange: ChangeEventHandler<HTMLInputElement> = event => {
		setPrivateValue(event.target.value);
		if (onChange) {
			onChange(event);
		}
	};

	const handleItemAdd = () => {
		if (onItemAdd && !isEmpty(privateValue)) {
			onItemAdd(privateValue)();
			setPrivateValue("");
		}
	};

	useEffect(() => {
		if (value) {
			setPrivateValue(value);
		}
	}, [value]);

	useEffect(() => {
		let url: string;
		if (image) {
			url = URL.createObjectURL(image);
			setImageURL(url);
		}
		return () => {
			if (image) {
				URL.revokeObjectURL(url);
			}
		};
	}, [image]);

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
					src={imageURL}
					alt="Album Cover"
					className={bem("image", `image-${imageOrientation}`, "Elevated")}
				/>
			)}
			{list && !isEmpty(list) && (
				<div className={bem("list", "FlexRowGapHalf MarginBottomHalf")}>
					{list.map(item => (
						<div key={item.index} className="Elevated FlexRow Rounded PaddingQuart">
							<p className="ParagraphOne">{item.value}</p>
							<Button
								transparent
								icon="close"
								className={bem("list-close")}
								onClick={onItemRemove!(item.index)}
								iconClassName={bem("list-close-icon")}
							/>
						</div>
					))}
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
				{...propTypes}
			/>
			{(action || check) && (
				<div className={bem("right", "FlexRowGapQuart")}>
					{action && !action.disabled && (
						<a
							tabIndex={999}
							target="_blank"
							rel="noreferrer"
							href={action.url}
							title={action.title}
							children={<Button transparent tabIndex={999} icon={action.icon} text={action.text} />}
						/>
					)}
					{check && !isNull(check.value) && (
						<Button
							transparent
							tabIndex={999}
							text={check.text}
							className={bem("check")}
							icon={check.loading ? "loop" : check.value ? "check_circle" : "cancel"}
							iconClassName={bem(
								check.loading ? "check-loading" : check.value ? "check-valid" : "check-invalid",
							)}
						/>
					)}
				</div>
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
	);
};

type InputPropTypes = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"type" | "value" | "list" | "className"
>;

export type CheckOptionsText = string | null;

export type CheckOptionsValue = boolean | null;

interface CheckOptions {
	loading: boolean;
	text?: CheckOptionsText;
	value: CheckOptionsValue;
}

interface ActionOptions {
	url: string;
	icon: string;
	text: string;
	title?: string;
	disabled?: boolean;
}

interface PropTypes extends InputPropTypes {
	type: string;
	image?: File;
	list?: Item[];
	value?: string;
	className?: BEMInput;
	check?: CheckOptions;
	action?: ActionOptions;
	onItemAdd?: (value: string) => () => void;
	imageOrientation?: "portrait" | "landscape";
	onItemRemove?: (index: number) => () => void;
}

export default TextField;
