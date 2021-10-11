import {
	FC,
	useState,
	Fragment,
	createElement,
	ChangeEventHandler,
} from "react"

import Button from "@oly_op/react-button"
import { BEMInput, BEMPropTypes, createBEM } from "@oly_op/bem"

import Modal from "../../modal"
import { useDispatch, updateVolume, useStateVolume } from "../../../redux"

import "./index.scss"

const bem =
	createBEM("BarVolume")

const BarVolume: FC<PropTypes> = ({ className, iconClassName }) => {
	const dispatch = useDispatch()
	const volume = useStateVolume()

	const [ modal, setModal ] =
		useState(false)

	const handleModalOpen =
		() => setModal(true)

	const handleModalClose =
		() => setModal(false)

	const handleVolumeMute =
		() => {
			dispatch(updateVolume(0))
		}

	const handleVolumeFull =
		() => {
			dispatch(updateVolume(100))
		}

	const handleChange: ChangeEventHandler<HTMLInputElement> =
		({ target: { value } }) => {
			dispatch(updateVolume(parseInt(value)))
		}

	return (
		<Fragment>
			<Button
				title="Volume"
				transparent={!modal}
				className={className}
				onClick={handleModalOpen}
				iconClassName={iconClassName}
				icon={volume === 0 ? "volume_off" : "volume_up"}
			/>
			{modal && (
				<Modal
					onClose={handleModalClose}
					contentClassName={bem("content", "PaddingHalf")}
				>
					<Button
						transparent
						icon="volume_up"
						onClick={handleVolumeFull}
					/>
					<input
						min={0}
						step={1}
						max={100}
						type="range"
						value={volume}
						onChange={handleChange}
						className={bem("slider")}
					/>
					<Button
						transparent
						icon="volume_off"
						onClick={handleVolumeMute}
					/>
				</Modal>
			)}
		</Fragment>
	)
}

interface PropTypes extends BEMPropTypes {
	iconClassName?: BEMInput,
}

export default BarVolume