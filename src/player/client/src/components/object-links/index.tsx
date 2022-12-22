import { FC, Fragment, createElement } from "react";

import { OnClickPropTypes } from "../../types";
import ObjectLink, { ObjectLinkOptions } from "../object-link";
import determineConcat from "./determine-concat";

const ObjectLinks: FC<PropTypes> = ({ links, onClick, ampersand = true }) => (
	<Fragment>
		{links.map((link, index) => (
			<Fragment key={link.path}>
				<ObjectLink link={link} onClick={onClick} />
				{determineConcat(links, index, ampersand)}
			</Fragment>
		))}
	</Fragment>
);

interface PropTypes extends OnClickPropTypes {
	ampersand?: boolean;
	links: ObjectLinkOptions[];
}

export default ObjectLinks;
