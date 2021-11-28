import isEmpty from "lodash/isEmpty"
import { createElement, VFC } from "react"
import { createBEM, BEMPropTypes } from "@oly_op/bem"

import Genre from "../genre"
import SelectOrderBy from "../select-order-by"
import { Genre as GenreType, GenresOrderByField } from "../../types"

const bem =
	createBEM("Genre")

const Genres: VFC<PropTypes> = ({
	className,
	genres = [],
	orderBy = false,
}) => (
	<div className={bem(className, isEmpty(genres) || "Elevated")}>
		{orderBy && (
			<SelectOrderBy
				orderBy={{
					key: "genres",
					fields: Object.keys(GenresOrderByField),
				}}
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
	orderBy?: boolean,
	genres?: GenreType[],
}

export default Genres