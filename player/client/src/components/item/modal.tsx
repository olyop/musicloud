import uniqueID from "lodash-es/uniqueId"
import { createElement, VFC } from "react"
import isFunction from "lodash-es/isFunction"

import { Handler } from "../../types"
import { OptionsModal } from "./types"
import Modal, { ModalButton, ModalButtons, ModalHeader } from "../modal"

const ItemModal: VFC<PropTypes> = ({ open, onClose, modalOptions }) => {
	const options = (
		isFunction(modalOptions) ?
			modalOptions(onClose) :
			modalOptions
	)
	return (
		<Modal open={open} onClose={onClose}>
			{options.header && (
				<ModalHeader
					onClose={onClose}
					{...options.header}
				/>
			)}
			{options.content}
			{options.buttons && (
				<ModalButtons>
					{options.buttons.map(
						button => (
							<ModalButton
								{...button}
								key={uniqueID()}
								onClose={onClose}
							/>
						),
					)}
				</ModalButtons>
			)}
		</Modal>
	)
}

interface PropTypes extends Required<OptionsModal> {
	open: boolean,
	onClose: Handler,
}

export default ItemModal