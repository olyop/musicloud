import { Field } from "./field";

const getInitialValues = <T>(fields: Field[]) =>
	fields.reduce(
		(values, field) => ({
			...values,
			[field.fieldID]: field.initialValue,
		}),
		{} as T,
	);

export default getInitialValues;
