import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import Metadata from "@oly_op/react-metadata"
import { useState, createElement, FC, Fragment } from "react"

import {
	useDispatch,
	updateTheme,
	useStateTheme,
	updateListStyle,
	toggleShowGenres,
	useStateListStyle,
	useStateShowGenres,
	toggleShowReleased,
	toggleShowDuration,
	useStateShowDuration,
	useStateShowReleased,
} from "../../redux"

import Modal, {
	ModalButton,
	ModalHeader,
	ModalButtons,
} from "../../components/modal"

import DELETE_USER from "./delete-user.gql"
import Select from "../../components/select"
import { useSignOut, useMutation } from "../../hooks"
import { SettingsListStyle, SettingsTheme } from "../../types"

import "./index.scss"

const bem =
	createBEM("SettingsPage")

const SettingsPage: FC = () => {
	const signOut = useSignOut()
	const theme = useStateTheme()
	const dispatch = useDispatch()
	const listStyle = useStateListStyle()
	const showGenres = useStateShowGenres()
	const showDuration = useStateShowDuration()
	const showReleased = useStateShowReleased()

	const [ deleteUserModal, setDeleteUserModal ] =
		useState(false)

	const [ deleteUser ] =
		useMutation(DELETE_USER)

	const handleToggleShowGenres =
		() => {
			dispatch(toggleShowGenres())
		}

	const handleToggleShowDuration =
		() => {
			dispatch(toggleShowDuration())
		}

	const handleToggleShowReleased =
		() => {
			dispatch(toggleShowReleased())
		}

	const handleThemeChange =
		(value: SettingsTheme) => {
			dispatch(updateTheme(value))
		}

	const handleListStyleChange =
		(value: SettingsListStyle) => {
			dispatch(updateListStyle(value))
		}

	const handleDeleteUser =
		async () => {
			await deleteUser()
			signOut()
		}

	const handleDeleteUserModalOpen =
		() => setDeleteUserModal(true)

	const handleDeleteUserModalClose =
		() => setDeleteUserModal(false)

	return (
		<Metadata title="Settings">
			<div className={bem("", "Content PaddingTopBottom")}>
				<h1 className="HeadingThree MarginBottom">
					Settings
				</h1>
				<div className="FlexColumnGap">
					<details open className={bem("details")}>
						<summary className={bem("summary", "BodyOne MarginBottomHalf")}>
							Appearance
						</summary>
						<div className={bem("details-content", "FlexColumnGapHalf ")}>
							<div>
								<p className="BodyTwo MarginBottomQuart">
									Theme:
								</p>
								<Select
									value={theme}
									onChange={handleThemeChange}
									className="BodyTwo MarginRightQuart"
									options={Object.keys(SettingsTheme)}
								/>
							</div>
							<div>
								<p className="BodyTwo MarginBottomQuart">
									List Style:
								</p>
								<Select
									value={listStyle}
									onChange={handleListStyleChange}
									className="BodyTwo MarginRightQuart"
									options={Object.keys(SettingsListStyle)}
								/>
							</div>
						</div>
					</details>
					<details open className={bem("details")}>
						<summary className={bem("summary", "BodyOne MarginBottomHalf")}>
							View
						</summary>
						<div className={bem("details-content", "FlexColumnGapHalf")}>
							<div>
								<p className="BodyTwo MarginBottomQuart">
									Song Duration:
								</p>
								<div className="FlexListGapFifth">
									<input
										type="checkbox"
										checked={showDuration}
										onChange={handleToggleShowDuration}
										className={bem("checkbox", "BodyTwo")}
									/>
									<p className="BodyTwo LightWeight">
										{showDuration ? "Show" : "Hide"}
									</p>
								</div>
							</div>
							<div>
								<p className="BodyTwo MarginBottomQuart">
									Song Genres:
								</p>
								<div className="FlexListGapFifth">
									<input
										type="checkbox"
										checked={showGenres}
										onChange={handleToggleShowGenres}
										className={bem("checkbox", "BodyTwo")}
									/>
									<p className="BodyTwo LightWeight">
										{showGenres ? "Show" : "Hide"}
									</p>
								</div>
							</div>
							<div>
								<p className="BodyTwo MarginBottomQuart">
									Album Released:
								</p>
								<div className="FlexListGapFifth">
									<input
										type="checkbox"
										className="Text"
										checked={showReleased}
										onChange={handleToggleShowReleased}
									/>
									<p className="BodyTwo LightWeight">
										{showReleased ? "Show" : "Hide"}
									</p>
								</div>
							</div>
						</div>
					</details>
					<details open className={bem("details")}>
						<summary className={bem("summary", "BodyOne MarginBottomHalf")}>
							Actions
						</summary>
						<div className={bem("controls", "details-content", "FlexColumnGapHalf")}>
							<Button
								text="Delete Account"
								icon="manage_accounts"
								onClick={handleDeleteUserModalOpen}
							/>
							<Button
								text="Logout"
								onClick={signOut}
								icon="exit_to_app"
							/>
						</div>
					</details>
				</div>
			</div>
			<Modal open={deleteUserModal} onClose={handleDeleteUserModalClose}>
				<ModalButtons>
					<ModalHeader
						text={(
							<Fragment>
								<Fragment>Are you sure you want</Fragment>
								<br/>
								<Fragment>to delete your account?</Fragment>
							</Fragment>
						)}
					/>
					<ModalButton
						text="Delete"
						icon="delete"
						onClick={handleDeleteUser}
					/>
					<ModalButton
						text="Cancel"
						icon="arrow_back"
						onClick={handleDeleteUserModalClose}
					/>
				</ModalButtons>
			</Modal>
		</Metadata>
	)
}

export default SettingsPage