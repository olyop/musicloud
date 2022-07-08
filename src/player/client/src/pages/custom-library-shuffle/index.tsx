import Button from "@oly_op/react-button"
import { createElement, FC } from "react"
import { Head } from "@oly_op/react-head"

import Content from "../../components/content"

const CustomLibraryShufflePage: FC = () => (
	<Head pageTitle="Custom Library Shuffle">
		<Content>
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
		</Content>
	</Head>
)

export default CustomLibraryShufflePage