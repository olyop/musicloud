import { BEMInput, createBEM } from "@oly_op/bem";
import "@oly_op/css-utilities/index.css";
// eslint-disable-next-line import/extensions, import/no-unresolved
import "@oly_op/react-button/index.css";
import isNull from "lodash-es/isNull";
import isString from "lodash-es/isString";
import { ChangeEventHandler, InputHTMLAttributes, createElement, useEffect, useState } from "react";

import "../../index.scss";
import "./index.scss";

const bem = createBEM("Input");

const Input = <T extends InputValue>(propTypes: InputPropTypes<T>) => {
	const { name, value, inputID, onChange, className, imageOrientation, ...inputPropTypes } =
		propTypes;

	const [imageURL, setImageURL] = useState<string | null>(null);

	const handleOnChange: ChangeEventHandler<HTMLInputElement> = event => {
		if (inputPropTypes.type === "file") {
			if (event.target.files) {
				onChange(event.target.files.item(0) as T);
			}
		} else {
			onChange(event.target.value as T);
		}
	};

	useEffect(() => {
		let url: string;
		if (!isNull(value) && !isString(value)) {
			url = URL.createObjectURL(value);
			setImageURL(url);
		}
		return () => {
			if (!isString(value)) {
				URL.revokeObjectURL(url);
			}
		};
	}, [value]);

	return (
		<div className={bem(className, "")}>
			<label children={name} htmlFor={inputID} className={bem("label")} />
			{!isNull(value) && !isString(value) && imageURL && imageOrientation && (
				<img
					src={imageURL}
					alt={value.name}
					className={bem(`image-${imageOrientation}`, "image", "Elevated")}
				/>
			)}
			<input
				type="text"
				id={inputID}
				name={inputID}
				onChange={handleOnChange}
				className={bem(
					imageURL && imageOrientation === "landscape" && "input-image-landscape",
					imageURL && "input-image",
					"input",
				)}
				value={isNull(value) ? undefined : isString(value) ? value : undefined}
				{...inputPropTypes}
			/>
		</div>
	);
};

export type InputValue = File | string;

export type InputImageOrientation = "portrait" | "landscape";

export type InputOnChange<T extends InputValue = string> = (value: T) => void;

type HTMLInputPropTypes = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"name" | "value" | "tabIndex" | "onChange" | "className"
>;

interface InputID {
	inputID: string;
}

export interface InputPropTypes<T extends InputValue> extends InputID, HTMLInputPropTypes {
	name: string;
	value: T | null;
	tabIndex: number;
	className?: BEMInput;
	onChange: InputOnChange<T>;
	imageOrientation?: InputImageOrientation;
}

export default Input;
