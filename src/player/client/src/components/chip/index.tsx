import { createBEM } from "@oly_op/bem";
import { createElement, FC } from "react";
import { ImageDimensions, ImageSizes, ObjectID } from "@oly_op/musicloud-common/build/types";

import ObjectLink from "../object-link";
import { createObjectPath, createCatalogImageURL } from "../../helpers";

import "./index.scss";

const bem = createBEM("Chip");

const Chip: FC<PropTypes> = ({ objectID, text, typeName }) => (
	<h2 className={bem("", "HeadingFive FlexRow")}>
		<img
			alt={text}
			crossOrigin="anonymous"
			className={bem("profile", "Elevated")}
			src={createCatalogImageURL(objectID, "profile", ImageSizes.HALF, ImageDimensions.SQUARE)}
		/>
		<ObjectLink
			className={bem("link")}
			link={{
				text,
				path: createObjectPath(typeName, objectID),
			}}
		/>
	</h2>
);

interface PropTypes extends ObjectID {
	text: string;
	typeName: "artist" | "user";
}

export default Chip;
