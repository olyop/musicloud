import Button from "@oly_op/react-button"
import { createElement, VFC } from "react"
import Metadata from "@oly_op/react-metadata"

const CustomShufflePage: VFC = () => (
	<Metadata title="Custom Shuffle">
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

export default CustomShufflePage