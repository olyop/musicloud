import { createBEM } from "@oly_op/bem";
import isEmpty from "lodash-es/isEmpty";
import isFunction from "lodash-es/isFunction";
import isUndefined from "lodash-es/isUndefined";
import { FC, ReactNode, createElement } from "react";

import { ClassNameBEMPropTypes, Genre, GenresOrderByField } from "../../types";
import List from "../list";
import SelectOrderBy from "../select-order-by";

const bem = createBEM("");

const Genres: FC<PropTypes> = ({ genres, children, className, orderBy = false }) => (
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
		<List alwaysList>
			{isFunction(children) ? (isUndefined(genres) ? genres : children(genres)) : children}
		</List>
	</div>
);

interface PropTypes extends ClassNameBEMPropTypes {
	genres?: Genre[];
	orderBy?: boolean;
	children: ((genres: Genre[]) => ReactNode) | ReactNode;
}

export default Genres;
