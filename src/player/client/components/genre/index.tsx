import { createElement, VFC } from "react"

import Item from "../item"
import ObjectLink from "../object-link"
import { Genre as GenreType } from "../../types"
import { determineObjectPath } from "../../helpers"

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
						path: determineObjectPath("genre", genre.genreID),
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