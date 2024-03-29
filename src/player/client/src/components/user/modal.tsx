import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types";
import { FC, createElement } from "react";

import { createCatalogImageURL, createObjectPath } from "../../helpers";
import { useToggleUserFollowing } from "../../hooks";
import { User as UserType } from "../../types";
import Modal, { ModalButton, ModalButtons, ModalHeader, ModalOnClose } from "../modal";
import ObjectLink from "../object-link";

const UserModal: FC<PropTypes> = ({ open, user, onClose }) => {
	const { userID, name } = user;

	const [toggleUserFollowing, isFollowing, isUser] = useToggleUserFollowing({ userID });

	return (
		<Modal open={open} onClose={onClose}>
			<ModalHeader
				shareData={{
					title: name,
					url: createObjectPath("user", userID),
				}}
				image={{
					description: name,
					src: createCatalogImageURL(userID, "profile", ImageSizes.MINI, ImageDimensions.SQUARE),
				}}
				text={
					<ObjectLink
						link={{
							text: name,
							path: createObjectPath("user", userID),
						}}
					/>
				}
			/>
			{isUser || (
				<ModalButtons>
					<ModalButton
						onClose={onClose}
						onClick={toggleUserFollowing}
						icon={isFollowing ? "done" : "add"}
						text={isFollowing ? "Following" : "Follow"}
					/>
				</ModalButtons>
			)}
		</Modal>
	);
};

interface PropTypes extends ModalOnClose {
	open: boolean;
	user: Pick<UserType, "userID" | "name">;
}

export default UserModal;
