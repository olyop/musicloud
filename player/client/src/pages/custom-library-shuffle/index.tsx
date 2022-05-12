import Button from "@oly_op/react-button"
import { createElement, FC } from "react"
import { Head } from "@oly_op/react-head"

const CustomLibraryShufflePage: FC = () => (
	<Head pageTitle="Custom Library Shuffle">
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
	</Head>
)

export default CustomLibraryShufflePage