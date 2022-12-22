import { BEMInput, createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { ChangeEventHandler, FC, Fragment, createElement, useState } from "react";

import Modal from "../../../components/modal";
import { updateVolume, useDispatch, useStateVolume } from "../../../redux";
import { ClassNameBEMPropTypes } from "../../../types";
import "./index.scss";

const bem = createBEM("BarVolume");

const BarVolume: FC<PropTypes> = ({ className, iconClassName }) => {
	const dispatch = useDispatch();
	const volume = useStateVolume();

	const [modal, setModal] = useState(false);

	const handleModalOpen = () => setModal(true);

	const handleModalClose = () => setModal(false);

	const handleVolumeMute = () => {
		dispatch(updateVolume(0));
	};

	const handleVolumeFull = () => {
		dispatch(updateVolume(100));
	};

	const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
		dispatch(updateVolume(Number.parseInt(value)));
	};

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
			<Modal
				open={modal}
				onClose={handleModalClose}
				contentClassName={bem("content", "PaddingHalf")}
				children={
					<Fragment>
						<Button transparent icon="volume_up" onClick={handleVolumeFull} />
						<input
							min={0}
							step={1}
							max={100}
							type="range"
							value={volume}
							onChange={handleChange}
							className={bem("slider", "OverflowHidden")}
						/>
						<Button transparent icon="volume_off" onClick={handleVolumeMute} />
					</Fragment>
				}
			/>
		</Fragment>
	);
};

interface PropTypes extends ClassNameBEMPropTypes {
	iconClassName?: BEMInput;
}

export default BarVolume;
