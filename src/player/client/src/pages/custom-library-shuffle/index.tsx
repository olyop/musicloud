import Button from "@oly_op/react-button";
import { createElement, FC } from "react";
import { Head } from "@oly_op/react-head";

const CustomLibraryShufflePage: FC = () => (
	<Head pageTitle="Library Shuffle">
		<div className="ContentPaddingTopBottom">
			<div className="FlexRowGapHalf">
				<Button icon="add" text="Genre" />
				<Button icon="add" text="Artist" />
			</div>
		</div>
	</Head>
);

export default CustomLibraryShufflePage;
