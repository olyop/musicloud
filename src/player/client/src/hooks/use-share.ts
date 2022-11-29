import { useEffect, useState } from "react";
import { ServicesNames } from "@oly_op/musicloud-common/build/types";
import { determineServiceURL } from "@oly_op/musicloud-common/build/determine-service-url";
import ms from "ms";

export const useShare = () => {
	const [icon, setIcon] = useState("share");
	const [text, setText] = useState("Share");

	const handleCannotShare = () => {
		setIcon("error");
		setText("Disabled");
	};

	const handler = async (data: ShareData) => {
		try {
			const navigatorVariable = navigator;
			if ("share" in navigatorVariable) {
				setText("Sharing");
				await navigator.share(data);
				setIcon("share");
			} else if ("clipboard" in navigatorVariable && data.url) {
				const serviceURL = determineServiceURL({ service: ServicesNames.PLAYER });
				setText("Copying");
				await navigator.clipboard.writeText(`${serviceURL.slice(0, -1)}${data.url}`);
				setIcon("done");
				setText("Copied");
			} else {
				handleCannotShare();
			}
		} catch {
			handleCannotShare();
		}
	};

	useEffect(() => {
		let timer: NodeJS.Timeout;
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
