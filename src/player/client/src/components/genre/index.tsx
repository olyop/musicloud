import isNull from "lodash-es/isNull";
import { createElement, forwardRef } from "react";

import { createObjectPath } from "../../helpers";
import { Genre as GenreType, ObjectShowIcon } from "../../types";
import Item from "../item";
import ObjectLink from "../object-link";

const Genre = forwardRef<HTMLDivElement, PropTypes>((propTypes, ref) => {
	const { genre, className, showIcon = false } = propTypes;

	return (
		<Item
			ref={ref}
			className={className}
			leftIcon={showIcon ? "list" : undefined}
			infoOptions={
				isNull(genre)
					? undefined
					: {
							upperLeft: (
								<ObjectLink
									link={{
										text: genre.name,
										path: createObjectPath("genre", genre.genreID),
									}}
								/>
							),
					  }
			}
		/>
	);
});

interface PropTypes extends ObjectShowIcon {
	className?: string;
	genre: Pick<GenreType, "name" | "genreID"> | null;
}

export default Genre;
