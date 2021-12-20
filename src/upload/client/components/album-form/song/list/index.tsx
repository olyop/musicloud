import isEmpty from "lodash/isEmpty"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { ChangeEventHandler, createElement, VFC } from "react"

import { Item } from "../../../../types"

import "./index.scss"

const bem =
	createBEM("AlbumFormSongList")

const AlbumFormSongList: VFC<PropTypes> = ({ list, onAdd, onChange }) => {
	const handleChange =
		(index: number): ChangeEventHandler<HTMLInputElement> =>
			({ target: { value } }) =>
				onChange(index)(value)
	return (
		<div className="FlexRowGapQuart">
			{isEmpty(list) || (
				<div className="FlexRowGapQuart">
					{list.map(
						({ index, value }) => (
							<input
								key={index}
								value={value}
								onChange={handleChange(index)}
								className={bem("text", "BodyTwo Rounded Elevated PaddingQuart")}
							/>
						),
					)}
				</div>
			)}
			<Button
				icon="add"
				transparent
				onClick={onAdd}
				className={bem("add")}
			/>
		</div>
	)
}

interface PropTypes {
	list: Item[],
	onAdd: () => void,
	onChange: (index: number) => (value: string) => void,
}

export default AlbumFormSongList