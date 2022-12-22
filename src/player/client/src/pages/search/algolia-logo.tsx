import { createBEM } from "@oly_op/bem";
import { FILES_URL } from "@oly_op/musicloud-common/build/globals";
import { FC, createElement } from "react";

import { useStateTheme } from "../../redux";
import { SettingsTheme } from "../../types";

const bem = createBEM("SearchPage");

const AlgoliaLogo: FC = () => {
	const theme = useStateTheme();

	const fileName = theme === SettingsTheme.DARK ? "white" : "blue";

	return (
		<img
			alt="Search by Algolia"
			crossOrigin="anonymous"
			src={`${FILES_URL}/algolia/${fileName}.svg`}
			className={bem("bar-input-right-algolia", "Rounded")}
		/>
	);
};

export default AlgoliaLogo;
