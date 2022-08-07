import { createBEM } from "@oly_op/bem"
import { createElement, FC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types"

import Item from "../item"
import Modal from "./modal"
import ObjectLink from "../object-link"
import { ObjectShowIcon, User as UserType } from "../../types"
import { createObjectPath, createCatalogImageURL } from "../../helpers"

const bem =
	createBEM("User")

const User: FC<PropTypes> = ({ user, className, showIcon = false }) => (
	<Item
		leftIcon={showIcon ? "person" : undefined}
		className={bem(className, "PaddingHalf ItemBorder")}
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
		modal={({ open, onClose }) => (
			<Modal
				open={open}
				user={user}
				onClose={onClose}
			/>
		)}
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
	/>
)

interface PropTypes extends ObjectShowIcon {
	className?: string,
	user: Pick<UserType, "userID" | "name">,
}

export default User