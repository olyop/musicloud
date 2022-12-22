import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import isEmpty from "lodash-es/isEmpty";
import { ChangeEventHandler, FC, createElement } from "react";

import { Item } from "../../../../types";
import "./index.scss";

const bem = createBEM("AlbumFormSongList");

const AlbumFormSongList: FC<PropTypes> = ({ list, onAdd, onChange, onRemove }) => {
	const handleChange =
		(index: number): ChangeEventHandler<HTMLInputElement> =>
		({ target: { value } }) =>
			onChange(index)(value);
	return (
		<div className="FlexRowGapQuart">
			{isEmpty(list) || (
				<div className="FlexRowGapQuart">
					{list.map(({ index, value }) => (
						<div key={index} className="Elevated FlexRow Rounded">
							<input
								value={value}
								onChange={handleChange(index)}
								className={bem("input", "ParagraphTwo PaddingQuart")}
							/>
							<Button
								transparent
								icon="close"
								onClick={onRemove(index)}
								className={bem("remove")}
							/>
						</div>
					))}
				</div>
			)}
			<Button icon="add" transparent onClick={onAdd} className={bem("add")} />
		</div>
	);
};

interface PropTypes {
	list: Item[];
	onAdd: () => void;
	onRemove: (index: number) => () => void;
	onChange: (index: number) => (value: string) => void;
}

export default AlbumFormSongList;
