import { createBEM } from "@oly_op/bem";
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common/build/types";
import Button from "@oly_op/react-button";
import uniqueID from "lodash-es/uniqueId";
import { FC, Fragment, createElement, useState } from "react";
import { Link } from "react-router-dom";

import Modal from "../../components/modal";
import { createCatalogImageURL, createObjectPath, formatPlays } from "../../helpers";
import { useClearCache, useJWTPayload, useSignOut } from "../../hooks";
import { addLoading, removeLoading, useDispatch } from "../../redux";
import { determineCacheSize } from "./determine-cache-size";

const clearCacheLoadingID = uniqueID();

const bem = createBEM("Header");

const HeaderAccountButton: FC = () => {
	const signOut = useSignOut();
	const dispatch = useDispatch();
	const clearCache = useClearCache();
	const { userID, name } = useJWTPayload();

	const [accountModal, setAccountModal] = useState(false);

	const handleAccountModalOpen = () => setAccountModal(true);

	const handleAccountModalClose = () => setAccountModal(false);

	const handleClearCache = async () => {
		dispatch(addLoading(clearCacheLoadingID));
		handleAccountModalClose();
		await clearCache();
		dispatch(removeLoading(clearCacheLoadingID));
		window.location.reload();
	};

	const handleClearCacheClick = () => {
		void handleClearCache();
	};

	const cacheSize = determineCacheSize();

	return (
		<Fragment>
			<Button
				transparent
				text="Account"
				className="Border"
				rightIcon="expand_more"
				onClick={handleAccountModalOpen}
				imageClassName={bem("account-button-image")}
				image={{
					description: name,
					src: createCatalogImageURL(userID, "profile", ImageSizes.MINI, ImageDimensions.SQUARE),
				}}
			/>
			<Modal
				open={accountModal}
				onClose={handleAccountModalClose}
				contentClassName={bem("account-modal-content", "FlexColumn Border")}
			>
				<Link
					onClick={handleAccountModalClose}
					to={createObjectPath("user", userID)}
					children={
						<Button
							transparent
							text="Account"
							title="Account"
							rightIcon="arrow_forward"
							className={bem("account-modal-content-button")}
							textClassName={bem("account-modal-content-button-text")}
							imageClassName={bem("account-button-image", "account-modal-content-button-image")}
							image={{
								description: name,
								src: createCatalogImageURL(
									userID,
									"profile",
									ImageSizes.MINI,
									ImageDimensions.SQUARE,
								),
							}}
						/>
					}
				/>
				<Button
					transparent
					icon="refresh"
					onClick={handleClearCacheClick}
					className={bem("account-modal-content-button")}
					text={
						<Fragment>
							<Fragment>Cache</Fragment>
							{cacheSize && (
								<Fragment>
									<Fragment> </Fragment>
									<span className={bem("account-modal-content-button-cache-size", "LightColor")}>
										{formatPlays(cacheSize)}
									</span>
								</Fragment>
							)}
						</Fragment>
					}
				/>
				<Link
					to="/settings"
					onClick={handleAccountModalClose}
					children={
						<Button
							transparent
							icon="settings"
							text="Settings"
							className={bem("account-modal-content-button")}
						/>
					}
				/>
				<Button
					transparent
					text="Sign Out"
					onClick={signOut}
					icon="exit_to_app"
					className={bem("account-modal-content-button")}
				/>
			</Modal>
		</Fragment>
	);
};

export default HeaderAccountButton;
