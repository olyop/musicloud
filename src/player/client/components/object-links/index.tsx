import { createElement, Fragment, FC } from "react"

import ObjectLink, {
	ObjectLinkOptions,
} from "../object-link"

import { OnClickPropTypes } from "../../types"
import determineConcat from "./determine-concat"

const ObjectLinks: FC<PropTypes> = ({
	links,
	onClick,
	ampersand = true,
}) => (
	<Fragment>
		{links.map(
			({ path, text }, index) => (
				<Fragment key={path}>
					<ObjectLink
						path={path}
						text={text}
						onClick={onClick}
					/>
					{determineConcat(links, index, ampersand)}
				</Fragment>
			),
		)}
	</Fragment>
)

interface PropTypes extends OnClickPropTypes {
	ampersand?: boolean,
	links: ObjectLinkOptions[],
}

export default ObjectLinks