import { createElement, FC } from "react"
import Metadata from "@oly_op/react-metadata"

const LibraryHome: FC = () => (
	<Metadata title="Library">
		<h2 className="BodyTwo Content Padding Elevated FlexColumnGapHalf">
			<label>
				Please choose one or more pets:
			</label>
			<select name="pets" multiple size={4}>
				<optgroup label="4-legged pets">
					<option value="dog">Dog</option>
					<option value="cat">Cat</option>
					<option value="hamster" disabled>Hamster</option>
				</optgroup>
				<optgroup label="Flying pets">
					<option value="parrot">Parrot</option>
					<option value="macaw">Macaw</option>
					<option value="albatross">Albatross</option>
				</optgroup>
			</select>
		</h2>
	</Metadata>
)

export default LibraryHome