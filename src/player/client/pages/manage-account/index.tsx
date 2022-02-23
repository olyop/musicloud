import { createBEM } from "@oly_op/bem"
import Button from "@oly_op/react-button"
import { Metadata } from "@oly_op/react-metadata"
import { createElement, Fragment, useState, VFC } from "react"

import Modal, {
	ModalHeader,
	ModalButton,
	ModalButtons,
} from "../../components/modal"

import DELETE_USER from "./delete-user.gql"
import CHANGE_PASSWORD from "./change-password.gql"
import { useMutation, useSignOut } from "../../hooks"

import "./index.scss"

const bem =
	createBEM("ManageAccount")

const ManageAccount: VFC = () => {
	const signOut = useSignOut()

	const [ deleteUserModal, setDeleteUserModal ] =
		useState(false)

	const [ deleteUser ] =
		useMutation(DELETE_USER)

	const [ changePassword ] =
		useMutation(CHANGE_PASSWORD)

	const handleDeleteUser =
		async () => {
			await deleteUser()
			signOut()
		}

	const handleChangePassword =
		async () => {
			await changePassword({
				variables: { password: "password" },
			})
		}

	const handleDeleteUserModalOpen =
		() => setDeleteUserModal(true)

	const handleDeleteUserModalClose =
		() => setDeleteUserModal(false)

	return (
		<Metadata title="Manage Account">
			<div className="Content PaddingTopBottom">
				<h1 className="HeadingThree MarginBottom">
					Manage
				</h1>
				<div className={bem("content", "FlexColumnGapHalf")}>
					<Button
						icon="password"
						text="Change Password"
						onClick={handleChangePassword}
					/>
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
			</div>
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
		</Metadata>
	)
}

export default ManageAccount