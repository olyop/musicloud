import { createElement, VFC } from "react"

import Item from "../item"
import ObjectLink from "../object-link"
import { createObjectPath } from "../../helpers"
import { Genre as GenreType, ObjectShowIcon } from "../../types"

const Genre: VFC<PropTypes> = ({
	genre,
	className,
	showIcon = false,
}) => (
	<Item
		className={className}
		leftIcon={showIcon ? "list" : undefined}
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

interface PropTypes extends ObjectShowIcon {
	genre: GenreType,
	className?: string,
}

export default Genre