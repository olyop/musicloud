import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { removeDashesFromUUID } from "@oly_op/uuid-dashes"
import { createElement, FC, useEffect, useState } from "react"
import { useHistory, useLocation, NavLink } from "react-router-dom"
import { ImageSizes, ImageDimensions } from "@oly_op/music-app-common/types"

import {
	useDispatch,
	toggleSidebar,
	updateIsOnline,
	useStateIsOnline,
	toggleIsFullscreen,
	useStateIsFullscreen,
} from "../../redux"

import Modal from "../modal"
import Window from "../window"
import { useSignOut } from "../../hooks"
import { getUserID, determineCatalogImageURL } from "../../helpers"

import "./index.scss"

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

const Header: FC = () => {
	const userID = getUserID()
	const signOut = useSignOut()
	const history = useHistory()
	const dispatch = useDispatch()
	const { pathname } = useLocation()
	const isOnline = useStateIsOnline()
	const isFullscreen = useStateIsFullscreen()

	const checkStatus =
		async () =>
			dispatch(updateIsOnline(await checkOnlineStatus()))

	const [ accountModal, setAccountModal ] =
		useState(false)

	const handleBack =
		() => history.goBack()

	const handleFoward =
		() => history.goForward()

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

	useEffect(() => {
		window.addEventListener("offline", () => {
			dispatch(updateIsOnline(false))
		})

		const id =
			setInterval(() => checkStatus(), 10000)

		return () => {
			window.removeEventListener("offline", () => {
				dispatch(updateIsOnline(false))
			})
			clearInterval(id)
		}
	}, [])

	return (
		<header className={bem("", "Elevated PaddingLeftRightHalf FlexListSpaceBetween")}>
			<Window>
				{({ width }) => (
					<div className={bem(width >= 700 || "left", "FlexList")}>
						<Button
							icon="menu"
							transparent
							title="Menu"
							onClick={handleMenuClick}
							className={bem("icon")}
						/>
						{width <= 700 && (
							<div className="MarginRightQuart FlexList">
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
			<div className="FlexListGapQuart">
				<NavLink
					to="/search"
					children={(
						<Button
							icon="search"
							title="Search"
							transparent={pathname !== "/search"}
						/>
					)}
				/>
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
					text="Account"
					title="Account"
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