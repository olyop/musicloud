import { createBEM } from "@oly_op/bem"
import { createElement, VFC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common"

import Item from "../item"
import ObjectLink from "../object-link"
import { useToggleUserFollowing } from "../../hooks"
import { ModalButton, ModalButtons } from "../modal"
import { ObjectShowIcon, User as UserType } from "../../types"
import { createObjectPath, createCatalogImageURL } from "../../helpers"

const bem =
	createBEM("User")

const User: VFC<PropTypes> = ({ user, className, showIcon = false }) => {
	const { userID } = user

	const [ toggleUserFollowing, isFollowing, isUser ] =
		useToggleUserFollowing({ userID })

	return (
		<Item
			leftIcon={showIcon ? "person" : undefined}
			className={bem(className, "PaddingHalf ItemBorder")}
			infoOptions={{
				upperLeft: (
					<ObjectLink
						link={{
							text: user.name,
							path: createObjectPath("user", userID),
						}}
					/>
				),
			}}
			inLibraryOptions={isUser ? undefined : {
				inLibrary: isFollowing,
				onClick: toggleUserFollowing,
			}}
			modalOptions={onClose => ({
				header: {
					shareData: {
						title: user.name,
						url: createObjectPath("user", userID),
					},
					image: {
						description: user.name,
						src: createCatalogImageURL(
							userID,
							"profile",
							ImageSizes.MINI,
							ImageDimensions.SQUARE,
						),
					},
					text: (
						<ObjectLink
							link={{
								text: user.name,
								path: createObjectPath("user", userID),
							}}
						/>
					),
				},
				content: (
					<ModalButtons>
						<ModalButton
							onClose={onClose}
							onClick={toggleUserFollowing}
							icon={isFollowing ? "done" : "add"}
							text={isFollowing ? "Following" : "Follow"}
						/>
					</ModalButtons>
				),
			})}
			imageOptions={{
				title: user.name,
				path: createObjectPath(
					"user",
					userID,
				),
				url: createCatalogImageURL(
					userID,
					"profile",
					ImageSizes.MINI,
					ImageDimensions.SQUARE,
				),
			}}
		/>
	)
}

interface PropTypes extends ObjectShowIcon {
	className?: string,
	user: Pick<UserType, "userID" | "name">,
}

export default User