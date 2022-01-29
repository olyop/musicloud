import { createElement, VFC } from "react"

import Item from "../item"
import ObjectLink from "../object-link"
import { createObjectPath } from "../../helpers"
import { Genre as GenreType } from "../../types"

const Genre: VFC<PropTypes> = ({
	genre,
	className,
	leftIcon = false,
}) => (
	<Item
		className={className}
		leftIcon={leftIcon ? "list" : undefined}
		infoOptions={{
			upperLeft: (
				<ObjectLink
					link={{
						text: genre.name,
						path: createObjectPath("genre", genre.genreID),
					}}
				/>
			),
		}}
	/>
)

interface PropTypes {
	genre: GenreType,
	leftIcon?: boolean,
	className?: string,
}

export default Genre