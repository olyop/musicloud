import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import isEmpty from "lodash-es/isEmpty";
import { FC, Fragment, PropsWithChildren, createElement } from "react";

import { removeError, useDispatch, useStateErrors } from "../../redux";
import { StateErrorID } from "../../types";
import "./index.scss";

const bem = createBEM("Errors");

export const ErrorProvider: FC<PropsWithChildren> = ({ children }) => {
	const dispatch = useDispatch();
	const errors = useStateErrors();

	const handleRemove =
		({ errorID }: StateErrorID) =>
		() => {
			dispatch(removeError(errorID));
		};

	return (
		<Fragment>
			{isEmpty(errors) || (
				<div className={bem("", "Elevated PaddingHalf FlexColumnGapQuart")}>
					{errors.map(error => (
						<div key={error.errorID} className="FlexRowSpaceBetween">
							<p className={bem("text", "ParagraphTwo")}>
								<b>{error.location}</b>
								<Fragment> - </Fragment>
								{error.message}
							</p>
							<Button
								transparent
								icon="close"
								className={bem("close")}
								onClick={handleRemove(error)}
								iconClassName={bem("close-text")}
							/>
						</div>
					))}
				</div>
			)}
			{children}
		</Fragment>
	);
};
