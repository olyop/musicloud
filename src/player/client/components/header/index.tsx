import uniqueID from "lodash/uniqueId"
import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { useApolloClient } from "@apollo/client"
import { useNavigate, NavLink } from "react-router-dom"
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { createElement, VFC, useEffect, useState } from "react"
import { ImageSizes, ImageDimensions } from "@oly_op/music-app-common/types"

import {
	addLoading,
	useDispatch,
	removeLoading,
	toggleSidebar,
	updateIsOnline,
	useStateIsOnline,
	toggleIsFullscreen,
	useStateIsFullscreen,
} from "../../redux"

import Modal from "../modal"
import Window from "../window"
import HeaderSearchButton from "./search-button"
import { useSignOut, useJWTPayload } from "../../hooks"
import { determineCatalogImageURL } from "../../helpers"

import "./index.scss"

const loadingID =
	uniqueID()

const timeout =
	(promise: Promise<unknown>) =>
		new Promise(
			(resolve, reject) => {
				setTimeout(() => {
					reject(new Error("Request timed out."))
				}, 3000)
				promise.then(resolve, reject)
			},
		)

const checkOnlineStatus =
	async () => {
		const controller =
			new AbortController()
		if (!navigator.onLine) {
			return navigator.onLine
		} else {
			try {
				await timeout(
					fetch("/ping.txt", {
						method: "GET",
						signal: controller.signal,
					}),
				)
				return true
			} catch (error) {
				controller.abort()
				return false
			}
		}
	}

const bem =
	createBEM("Header")

const Header: VFC = () => {
	const signOut = useSignOut()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const client = useApolloClient()
	const isOnline = useStateIsOnline()
	const { userID, name } = useJWTPayload()
	const isFullscreen = useStateIsFullscreen()

	const checkStatus =
		async () =>
			dispatch(updateIsOnline(await checkOnlineStatus()))

	const [ accountModal, setAccountModal ] =
		useState(false)

	const handleBack =
		() => navigate(-1)

	const handleFoward =
		() => navigate(1)

	const handleMenuClick =
		() => {
			dispatch(toggleSidebar())
		}

	const handleAccountModalOpen =
		() => setAccountModal(true)

	const handleAccountModalClose =
		() => setAccountModal(false)

	const handleFullscreenClick =
		() => {
			dispatch(toggleIsFullscreen())
			handleAccountModalClose()
		}

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
			}, 10000)

		return () => {
			window.removeEventListener("offline", () => {
				dispatch(updateIsOnline(false))
			})
			clearInterval(id)
		}
	}, [])

	return (
		<header className={bem("", "Elevated PaddingLeftRightHalf FlexRowSpaceBetween")}>
			<Window>
				{({ width }) => (
					<div className={bem(width >= 700 || "left", "FlexRow")}>
						<Button
							icon="menu"
							transparent
							title="Menu"
							className={bem("icon")}
							onClick={handleMenuClick}
						/>
						{width <= 700 && (
							<div className="MarginRightQuart FlexRow">
								<Button
									transparent
									title="Back"
									icon="arrow_back"
									onClick={handleBack}
									className={bem("icon")}
								/>
								<Button
									transparent
									title="Foward"
									icon="arrow_forward"
									onClick={handleFoward}
									className={bem("icon")}
								/>
							</div>
						)}
					</div>
				)}
			</Window>
			<div className="FlexRowGapQuart">
				<HeaderSearchButton/>
				{isOnline || (
					<Button
						transparent
						text="Offline"
						title="Account"
						icon="cloud_off"
						className={bem("offline")}
						spanClassName={bem("offline-span")}
					/>
				)}
				<Button
					transparent
					title={name}
					text="Account"
					className="Border"
					rightIcon="expand_more"
					onClick={handleAccountModalOpen}
					image={determineCatalogImageURL(
						userID,
						"profile",
						ImageSizes.MINI,
						ImageDimensions.SQUARE,
					)}
				/>
				<Modal
					open={accountModal}
					onClose={handleAccountModalClose}
					contentClassName={bem("account-modal-content", "FlexColumn Border")}
				>
					<NavLink
						onClick={handleAccountModalClose}
						to={`/user/${removeDashesFromUUID(userID)}`}
						children={(
							<Button
								transparent
								text="Account"
								title="Account"
								rightIcon="arrow_forward"
								className={bem("account-modal-content-button")}
								image={determineCatalogImageURL(
									userID,
									"profile",
									ImageSizes.MINI,
									ImageDimensions.SQUARE,
								)}
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
					<Button
						text={isFullscreen ? "Exit PWA" : "PWA"}
						transparent
						icon="fullscreen"
						title="Go Fullscreen"
						onClick={handleFullscreenClick}
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