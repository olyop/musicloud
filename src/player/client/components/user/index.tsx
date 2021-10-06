import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/music-app-common/types"

import Item from "../item"
import ObjectLink from "../object-link"
import { User as UserType } from "../../types"
import { determineObjectPath, determineCatalogImageURL } from "../../helpers"

const bem =
	createBEM("User")

const User: FC<PropTypes> = ({
	user,
	className,
	showIcon = false,
}) => (
	<Item
		leftIcon={showIcon ? "person" : undefined}
		infoOptions={{
			upperLeft: (
				<ObjectLink
					text={user.name}
					path={determineObjectPath("user", user.userID)}
				/>
			),
		}}
		imageOptions={{
			title: user.name,
			path: determineObjectPath("user", user.userID),
			url: determineCatalogImageURL(
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