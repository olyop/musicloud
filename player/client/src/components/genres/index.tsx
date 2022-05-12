import isEmpty from "lodash-es/isEmpty"
import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"

import Genre from "../genre"
import SelectOrderBy from "../select-order-by"
import { ClassNameBEMPropTypes, Genre as GenreType, GenresOrderByField } from "../../types"

const bem =
	createBEM("Genre")

const Genres: FC<PropTypes> = ({
	genres,
	className,
	orderBy = false,
}) => (
	<div className={bem(className, isEmpty(genres) || "Elevated")}>
		{orderBy && (
			<SelectOrderBy
				alwaysList
				className="PaddingHalf ItemBorder FlexRowRight"
				orderBy={{ key: "genres", fields: Object.keys(GenresOrderByField) }}
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

interface PropTypes extends ClassNameBEMPropTypes {
	orderBy?: boolean,
	genres: GenreType[],
}

export default Genres