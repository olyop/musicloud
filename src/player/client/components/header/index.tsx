import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { NavLink } from "react-router-dom"
import { useApolloClient } from "@apollo/client"
import { uniqueId as uniqueID } from "lodash-es"
import { createElement, VFC, useEffect, useState } from "react"
import { ImageSizes, ImageDimensions } from "@oly_op/music-app-common/types"

import {
	addLoading,
	useDispatch,
	removeLoading,
	toggleSidebar,
	updateIsOnline,
	useStateIsOnline,
} from "../../redux"

import Modal from "../modal"
import checkOnlineStatus from "./check-online-status"
import { useSignOut, useJWTPayload } from "../../hooks"
import { createCatalogImageURL, createObjectPath } from "../../helpers"

import "./index.scss"

const loadingID =
	uniqueID()

const bem =
	createBEM("Header")

const Header: VFC = () => {
	const signOut = useSignOut()
	const dispatch = useDispatch()
	const client = useApolloClient()
	const isOnline = useStateIsOnline()
	const { userID, name } = useJWTPayload()

	const checkStatus =
		async () =>
			dispatch(updateIsOnline(await checkOnlineStatus()))

	const [ accountModal, setAccountModal ] =
		useState(false)

	const handleMenuClick =
		() => {
			dispatch(toggleSidebar())
		}

	const handleAccountModalOpen =
		() => setAccountModal(true)

	const handleAccountModalClose =
		() => setAccountModal(false)

	const handleRefresh =
		async () => {
			dispatch(addLoading(loadingID))
			handleAccountModalClose()
			await client.refetchQueries({ include: "all" })
			dispatch(removeLoading(loadingID))
		}

	useEffect(() => {
		window.addEventListener("offline", () => {
			dispatch(updateIsOnline(false))
		})

		const id =
			setInterval(() => {
				void checkStatus()
			}, 20000)

		return () => {
			window.removeEventListener("offline", () => {
				dispatch(updateIsOnline(false))
			})
			clearInterval(id)
		}
	}, [])

	return (
		<header className={bem("", "Elevated FlexRowSpaceBetween")}>
			<Button
				icon="menu"
				transparent
				title="Menu"
				onClick={handleMenuClick}
				className={bem("left", "icon")}
			/>
			<div className="FlexRowGapQuart PaddingRightHalf">
				<NavLink to="/search">
					{({ isActive }) => (
						<Button
							icon="search"
							title="Search"
							transparent={!isActive}
						/>
					)}
				</NavLink>
				{isOnline || (
					<Button
						transparent
						title="Offline"
						icon="cloud_off"
						className={bem("offline")}
						spanClassName={bem("offline-span")}
					/>
				)}
				<Button
					transparent
					text="Account"
					className="Border"
					rightIcon="expand_more"
					onClick={handleAccountModalOpen}
					imageClassName={bem("account-button")}
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
					<NavLink
						onClick={handleAccountModalClose}
						to={createObjectPath("user", userID)}
						children={(
							<Button
								transparent
								text="Account"
								title="Account"
								rightIcon="arrow_forward"
								className={bem("account-modal-content-button")}
								imageClassName={bem("account-modal-content-button-image")}
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
					<NavLink
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
						text="Logout"
						onClick={signOut}
						icon="exit_to_app"
						className={bem("account-modal-content-button")}
					/>
				</Modal>
			</div>
		</header>
	)
}

export default Header