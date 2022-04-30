import Button from "@oly_op/react-button"
import { createElement, FC } from "react"
import { Metadata } from "@oly_op/react-metadata"

const CustomLibraryShufflePage: FC = () => (
	<Metadata title="Custom Library Shuffle">
		<div className="Content PaddingTopBottom">
			<div className="FlexRowGapHalf">
				<Button
					icon="add"
					text="Genre"
				/>
				<Button
					icon="add"
					text="Artist"
				/>
			</div>
		</div>
	</Metadata>
)

export default CustomLibraryShufflePage