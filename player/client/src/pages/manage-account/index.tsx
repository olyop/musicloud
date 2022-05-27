import { createBEM } from "@oly_op/bem"
import { Head } from "@oly_op/react-head"
import Button from "@oly_op/react-button"
import { createElement, Fragment, useEffect, useState, FC } from "react"

import Modal, {
	ModalHeader,
	ModalButton,
	ModalButtons,
} from "../../components/modal"

import Page from "../../components/page"
import Content from "../../components/content"
import { useMutation, useSignOut } from "../../hooks"

import DELETE_USER from "./delete-user.gql"
import CHANGE_PASSWORD from "./change-password.gql"

import "./index.scss"

const bem =
	createBEM("ManageAccount")

const ManageAccount: FC = () => {
	const signOut = useSignOut()

	const [ deleteUserModal, setDeleteUserModal ] =
		useState(false)

	const [ deleteUser, { data } ] =
		useMutation(DELETE_USER)

	const [ changePassword ] =
		useMutation(CHANGE_PASSWORD)

	const handleDeleteUser =
		() => {
			void deleteUser()
		}

	const handleChangePassword =
		() => {
			void changePassword({
				variables: {
					password: "password",
				},
			})
		}

	const handleDeleteUserModalOpen =
		() => setDeleteUserModal(true)

	const handleDeleteUserModalClose =
		() => setDeleteUserModal(false)

	useEffect(() => {
		if (data) {
			signOut()
		}
	}, [data])

	return (
		<Head pageTitle="Manage Account">
			<Page>
				<Content className={bem("content", "FlexColumnGapHalf")}>
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
				</Content>
			</Page>
		</Head>
	)
}

export default ManageAccount