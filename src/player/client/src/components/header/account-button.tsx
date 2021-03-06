import { Link } from "react-router-dom"
import { createBEM } from "@oly_op/bem"
import uniqueID from "lodash-es/uniqueId"
import Button from "@oly_op/react-button"
import { useApolloClient } from "@apollo/client"
import { createElement, Fragment, useState, FC } from "react"
import { ImageDimensions, ImageSizes } from "@oly_op/musicloud-common"

import Modal from "../modal"
import { useJWTPayload, useSignOut } from "../../hooks"
import { addLoading, removeLoading, useDispatch } from "../../redux"
import { createCatalogImageURL, createObjectPath } from "../../helpers"

const bem =
	createBEM("Header")

const loadingID =
	uniqueID()

const HeaderAccountButton: FC = () => {
	const signOut = useSignOut()
	const dispatch = useDispatch()
	const client = useApolloClient()
	const { userID, name } = useJWTPayload()

	const [ accountModal, setAccountModal ] =
		useState(false)

	const handleAccountModalOpen =
		() => setAccountModal(true)

	const handleAccountModalClose =
		() => setAccountModal(false)

	const handleRefresh =
		() => {
			dispatch(addLoading(loadingID))
			handleAccountModalClose()
			void (
				client
					.refetchQueries({ include: "all" })
					.then(() => (
						dispatch(removeLoading(loadingID))
					))
			)
		}

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
					src: createCatalogImageURL(
						userID,
						"profile",
						ImageSizes.MINI,
						ImageDimensions.SQUARE,
					),
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
					children={(
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
					)}
				/>
				<Button
					transparent
					icon="refresh"
					text="Refresh"
					onClick={handleRefresh}
					className={bem("account-modal-content-button")}
				/>
				<Link
					to="/settings"
					onClick={handleAccountModalClose}
					children={(
						<Button
							transparent
							icon="settings"
							text="Settings"
							className={bem("account-modal-content-button")}
						/>
					)}
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
	)
}

export default HeaderAccountButton