import { createElement, VFC } from "react"

import Songs from "../../components/songs"
import { Disc as DiscType } from "../../types"

const Disc: VFC<PropTypes> = ({
	isSingle,
	className,
	disc: { songs, index, hideLabel },
}) => (
	<div className={className}>
		{hideLabel || (
			<h4
				children={`Disc ${index}`}
				className="BodyTwo MarginBottomHalf UpperCase"
			/>
		)}
		<Songs
			hideCover
			hideIndex
			songs={songs}
			orderBy={false}
			hideTrackNumber={isSingle}
		/>
	</div>
)

interface PropTypes {
	disc: DiscType,
	isSingle: boolean,
	className?: string,
}

export default Disc