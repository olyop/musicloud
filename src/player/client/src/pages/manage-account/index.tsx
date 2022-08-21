import isEmpty from "lodash-es/isEmpty"
import { createBEM } from "@oly_op/bem"
import { Head } from "@oly_op/react-head"
import Button from "@oly_op/react-button"
import { createElement, Fragment, useEffect, useState, FC } from "react"

import Modal, {
	ModalHeader,
	ModalButton,
	ModalButtons,
} from "../../components/modal"

import Page from "../../layouts/page"
import { useMutation, useSignOut } from "../../hooks"
import Input, { InputOnChange } from "../../components/input"

import DELETE_USER from "./delete-user.gql"
import CHANGE_PASSWORD from "./change-password.gql"

import "./index.scss"

const bem =
	createBEM("ManageAccount")

const ManageAccount: FC = () => {
	const signOut = useSignOut()

	const [ deleteUserModal, setDeleteUserModal ] =
		useState(false)

	const [ changePasswordModal, setChangePasswordModal ] =
		useState(false)

	const [ newPassword, setNewPassword ] =
		useState("")

	const [ deleteUser, deleteUserResult ] =
		useMutation(DELETE_USER)

	const [ changePassword, changePasswordResult ] =
		useMutation(CHANGE_PASSWORD)

	const handleDeleteUser =
		() => {
			if (!deleteUserResult.loading) {
				void deleteUser()
			}
		}

	const handleNewPasswordChange: InputOnChange =
		value => setNewPassword(value)

	const handleChangePasswordSubmit =
		() => {
			if (!changePasswordResult.loading && !isEmpty(newPassword)) {
				void changePassword({
					variables: {
						password: newPassword,
					},
				})
			}
		}

	const handleDeleteUserModalOpen =
		() => setDeleteUserModal(true)

	const handleDeleteUserModalClose =
		() => setDeleteUserModal(false)

	const handleChangePasswordModalOpen =
		() => setChangePasswordModal(true)

	const handleChangePasswordModalClose =
		() => {
			setNewPassword("")
			setChangePasswordModal(false)
		}

	useEffect(() => {
		if (deleteUserResult.data) {
			signOut()
		}
	}, [deleteUserResult.data])

	useEffect(() => {
		if (changePasswordResult.data) {
			handleChangePasswordModalClose()
		}
	}, [changePasswordResult.data])

	return (
		<Head pageTitle="Manage Account">
			<Page>
				<div className={bem("", "Content PaddingTopBottom FlexColumnGapHalf")}>
					<Button
						icon="password"
						text="Change Password"
						onClick={handleChangePasswordModalOpen}
					/>
					<Modal open={changePasswordModal} onClose={handleChangePasswordModalClose} className="Padding">
						<h1 className="HeadingFive MarginBottom">
							Change Password
						</h1>
						<Input
							tabIndex={1}
							type="password"
							name="Password"
							placeholder="Password"
							value={newPassword}
							className="MarginBottom"
							inputID="addToPlaylistTitle"
							onChange={handleNewPasswordChange}
						/>
						<div className="FlexRowGapHalf">
							<Button
								icon="edit"
								tabIndex={2}
								text="Submit"
								onClick={handleChangePasswordSubmit}
							/>
							<Button
								transparent
								icon="close"
								text="Close"
								tabIndex={3}
								onClick={handleChangePasswordModalClose}
							/>
						</div>
					</Modal>
					<Button
						text="Delete Account"
						icon="manage_accounts"
						onClick={handleDeleteUserModalOpen}
					/>
					<Modal open={deleteUserModal} onClose={handleDeleteUserModalClose}>
						<ModalHeader
							hideShare
							text={(
								<Fragment>
									<Fragment>Are you sure you want</Fragment>
									<br/>
									<Fragment>to delete your account?</Fragment>
								</Fragment>
							)}
						/>
						<ModalButtons>
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
					<Button
						text="Logout"
						onClick={signOut}
						icon="exit_to_app"
					/>
				</div>
			</Page>
		</Head>
	)
}

export default ManageAccount