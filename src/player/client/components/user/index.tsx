import { createBEM } from "@oly_op/bem"
import { createElement, VFC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import Item from "../item"
import ObjectLink from "../object-link"
import { User as UserType } from "../../types"
import { createObjectPath, createCatalogImageURL } from "../../helpers"

const bem =
	createBEM("User")

const User: VFC<PropTypes> = ({
	user,
	className,
	showIcon = false,
}) => (
	<Item
		leftIcon={showIcon ? "person" : undefined}
		infoOptions={{
			upperLeft: (
				<ObjectLink
					link={{
						text: user.name,
						path: createObjectPath("user", user.userID),
					}}
				/>
			),
		}}
		imageOptions={{
			title: user.name,
			path: createObjectPath(
				"user",
				user.userID,
			),
			url: createCatalogImageURL(
				user.userID,
				"profile",
				ImageSizes.MINI,
				ImageDimensions.SQUARE,
			),
		}}
		className={bem(className, "PaddingHalf ItemBorder")}
	/>
)

interface PropTypes {
	user: UserType,
	showIcon?: boolean,
	className?: string,
}

export default User