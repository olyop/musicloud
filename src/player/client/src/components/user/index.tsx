import { createBEM } from "@oly_op/bem";
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types";
import { FC, createElement } from "react";

import { createCatalogImageURL, createObjectPath } from "../../helpers";
import { ObjectShowIcon, User as UserType } from "../../types";
import Item from "../item";
import ObjectLink from "../object-link";
import Modal from "./modal";

const bem = createBEM("User");

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
		modal={({ open, onClose }) => <Modal open={open} user={user} onClose={onClose} />}
		imageOptions={{
			title: user.name,
			path: createObjectPath("user", user.userID),
			url: createCatalogImageURL(user.userID, "profile", ImageSizes.MINI, ImageDimensions.SQUARE),
		}}
	/>
);

interface PropTypes extends ObjectShowIcon {
	className?: string;
	user: Pick<UserType, "userID" | "name">;
}

export default User;
