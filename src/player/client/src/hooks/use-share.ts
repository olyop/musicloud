import { useEffect, useState } from "react";
import { ServicesNames } from "@oly_op/musicloud-common/build/types";
import { determineServiceURL } from "@oly_op/musicloud-common/build/determine-service-url";
import ms from "ms";

export const useShare = () => {
	const [icon, setIcon] = useState("share");
	const [text, setText] = useState("Share");

	const handler = (data: ShareData) => {
		if ("share" in navigator) {
			void navigator.share(data);
			setIcon("share");
			setText("Sharing");
		} else if ("clipboard" in navigator && data.url) {
			const serviceURL = determineServiceURL({ service: ServicesNames.PLAYER });
			void navigator.clipboard.writeText(`${serviceURL.slice(0, -1)}${data.url}`);
			setIcon("done");
			setText("Copied");
		} else {
			setIcon("error");
			setText("Disabled");
		}
	};

	useEffect(() => {
		let timer: NodeJS.Timer;
		if (text) {
			timer = setTimeout(() => {
				setIcon("share");
				setText("Share");
			}, ms("2s"));
		}
		return () => clearTimeout(timer);
	}, [text]);

	return [
		handler,
		{
			shareIcon: icon,
			shareText: text,
		},
	] as const;
};
