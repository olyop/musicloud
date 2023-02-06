import Button from "@oly_op/react-button";
import { FC, createElement } from "react";
import { useNavigate } from "react-router-dom";

import "./navigation-buttons.scss";

const NavigationButtons: FC = () => {
	const navigate = useNavigate();
	const handleBack = () => navigate(-1);
	const handleForward = () => navigate(1);
	return (
		<div className="NavigationButtons FlexRow">
			<Button
				icon="arrow_back"
				title="Go Back"
				isHTMLButton={false}
				transparent
				onClick={handleBack}
			/>
			<Button
				icon="arrow_forward"
				title="Go Forward"
				isHTMLButton={false}
				transparent
				onClick={handleForward}
			/>
		</div>
	);
};

export default NavigationButtons;
