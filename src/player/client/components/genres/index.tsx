import isEmpty from "lodash/isEmpty"
import { createElement, FC } from "react"
import { createBEM, BEMPropTypes } from "@oly_op/bem"

import Genre from "../genre"
import SelectOrderBy from "../select-order-by"
import { Genre as GenreType } from "../../types"

const bem =
	createBEM("Genre")

const Genres: FC<PropTypes> = ({
	className,
	genres = [],
	orderByFields,
	hideOrderBy = false,
}) => (
	<div className={bem(className, isEmpty(genres) || "Elevated")}>
		{hideOrderBy || (
			<SelectOrderBy
				settingsKey="genres"
				fieldOptions={orderByFields}
				className="PaddingHalf ItemBorder FlexListRight"
			/>
		)}
		{genres.map(
			genre => (
				<Genre
					genre={genre}
					key={genre.genreID}
					className="ItemBorder PaddingHalf"
				/>
			),
		)}
	</div>
)

interface PropTypes extends BEMPropTypes {
	genres?: GenreType[],
	hideOrderBy?: boolean,
	orderByFields: string[],
}

export default Genres