import {
	FC,
	Fragment,
	createElement,
	FormEventHandler,
} from "react"

import Button from "@oly_op/react-button"

import getInitialValues from "./get-initial-values"
import FormField, { Field, FieldValue, FieldTypeEnum } from "./field"

const Form: FC<PropTypes> = ({ title, loading, onSubmit, children }) => {
	if (loading) {
		return (
			<p className="HeadingFive">
				Loading...
			</p>
		)
	} else {
		return (
			<form
				onSubmit={onSubmit}
				className="FlexColumnGap"
			>
				<h1 className="HeadingFive">
					<Fragment>Upload </Fragment>
					{title}
				</h1>
				<div className="FlexColumnGap">
					{children}
				</div>
				<Button
					icon="send"
					type="submit"
					text="Submit"
					className="Elevated"
				/>
			</form>
		)
	}
}

interface PropTypes {
	title: string,
	loading: boolean,
	onSubmit: FormEventHandler<HTMLFormElement>,
}

export default Form
export { getInitialValues }
export { Field, FormField, FieldValue, FieldTypeEnum }