import { createBEM } from "@oly_op/bem";
import { useFormik } from "formik";
import { ChangeEventHandler, FC, createElement } from "react";

import "./index.scss";
import TextField from "./text-field";

export enum FieldTypeEnum {
	TEXT = "TEXT",
	DATE = "DATE",
	IMAGE = "IMAGE",
}

export type FieldValue = string | number | null | Blob;

export interface Field {
	name: string;
	fieldID: string;
	landscape?: boolean;
	type: FieldTypeEnum;
	placeholder?: string;
	initialValue?: FieldValue;
}

const bem = createBEM("FormField");

const FormField: FC<PropTypes> = ({ field, value, onChange }) => {
	if (field.type === FieldTypeEnum.IMAGE) {
		return (
			<div key={field.fieldID} className="FlexColumnGapQuart">
				<p className={bem("image-label")}>{field.name}</p>
				<div className={bem("image-box", "FlexColumnGapHalf")}>
					{value && (
						<img
							alt="img"
							src={value}
							className={bem(
								field.landscape ? "image-image-landscape" : "image-image-portrait",
								"image-image",
								"Elevated",
							)}
						/>
					)}
					<input
						type="file"
						name={field.name}
						id={field.fieldID}
						onChange={onChange}
						className={bem("image-input")}
					/>
				</div>
			</div>
		);
	} else {
		return (
			<TextField
				value={value}
				name={field.name}
				key={field.fieldID}
				onChange={onChange}
				fieldID={field.fieldID}
				placeholder={field.placeholder}
				type={field.type === FieldTypeEnum.DATE ? "date" : undefined}
			/>
		);
	}
};

interface PropTypes {
	field: Field;
	value?: string;
	onChange: ChangeEventHandler;
	setFieldValue: ReturnType<typeof useFormik>["setFieldValue"];
}

export default FormField;
