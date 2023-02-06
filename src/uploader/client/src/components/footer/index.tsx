import { createBEM } from "@oly_op/bem";
import { determineServiceURL } from "@oly_op/musicloud-common/build/determine-service-url";
import { ServicesNames } from "@oly_op/musicloud-common/build/types";
import Button from "@oly_op/react-button";
import { FC, createElement } from "react";

import "./index.scss";

const bem = createBEM("Footer");

const Footer: FC = () => (
	<a
		target="_blank"
		rel="noreferrer"
		className={bem("", "Elevated")}
		href={determineServiceURL({ service: ServicesNames.PLAYER })}
	>
		<Button transparent text="Musicloud" icon="arrow_back" className={bem("button")} />
	</a>
);

export default Footer;
