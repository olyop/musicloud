import isEmpty from "lodash-es/isEmpty"
import { createBEM } from "@oly_op/bem"
import { createElement, FC, ReactNode } from "react"

import SelectOrderBy from "../select-order-by"
import { ClassNameBEMPropTypes, Genre, GenresOrderByField } from "../../types"

const bem =
	createBEM("")

const Genres: FC<PropTypes> = ({
	genres,
	children,
	className,
	orderBy = false,
}) => (
	<div className={bem(className, isEmpty(genres) || "Elevated")}>
		{orderBy && (
			<SelectOrderBy
				alwaysList
				className="PaddingHalf ItemBorder FlexRowRight"
				orderBy={{
					key: "genres",
					fields: Object.keys(GenresOrderByField),
				}}
			/>
		)}
		{children(genres)}
	</div>
)

interface PropTypes extends ClassNameBEMPropTypes {
	genres: Genre[],
	orderBy?: boolean,
	children: (genres: Genre[]) => ReactNode,
}

export default Genres