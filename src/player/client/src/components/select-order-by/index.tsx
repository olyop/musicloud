import { createBEM } from "@oly_op/bem";
import { CSSProperties, FC, createElement } from "react";

import { updateOrderBy, useDispatch, useStateListStyle, useStateOrderBy } from "../../redux";
import {
	ClassNameBEMPropTypes,
	OrderBy,
	OrderByDirection,
	OrderByOptions,
	SettingsListStyle,
	SettingsOrderBy,
} from "../../types";
import Select from "../select";
import "./index.scss";

const bem = createBEM("SelectOrderBy");

const SelectOrderBy: FC<PropTypes> = ({ orderBy, className, alwaysList = false }) => {
	const dispatch = useDispatch();
	const listStyle = useStateListStyle();
	const state = useStateOrderBy(orderBy.key);

	const handleChange = (key: keyof OrderBy) => (value: string) => {
		dispatch(
			updateOrderBy({
				key,
				value,
				settingsKey: orderBy.key,
			}),
		);
	};

	const style: CSSProperties = {
		gap: alwaysList || listStyle === SettingsListStyle.LIST ? "var(--space-quart)" : undefined,
	};

	return (
		<div className={bem(className, "")} style={style}>
			<Select value={state.field} options={orderBy.fields} onChange={handleChange("field")} />
			<Select
				value={state.direction}
				onChange={handleChange("direction")}
				options={Object.keys(OrderByDirection)}
			/>
		</div>
	);
};

interface PropTypes extends ClassNameBEMPropTypes {
	alwaysList?: boolean;
	orderBy: OrderByOptions<SettingsOrderBy>;
}

export default SelectOrderBy;
