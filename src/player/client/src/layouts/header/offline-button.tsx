import { createBEM } from "@oly_op/bem";
import Button from "@oly_op/react-button";
import { FC, createElement, useEffect } from "react";

import { updateIsOnline, useDispatch, useStateIsOnline } from "../../redux";
import checkOnlineStatus from "./check-online-status";

const bem = createBEM("Header");

const HeaderOfflineButton: FC = () => {
	const dispatch = useDispatch();
	const isOnline = useStateIsOnline();

	const checkStatus = async () => dispatch(updateIsOnline(await checkOnlineStatus()));

	const handleOnOffline = () => {
		dispatch(updateIsOnline(false));
	};

	useEffect(() => {
		window.addEventListener("offline", handleOnOffline);

		const id = setInterval(() => {
			void checkStatus();
		}, 10_000);

		return () => {
			window.removeEventListener("offline", handleOnOffline);
			clearInterval(id);
		};
	}, []);

	return isOnline ? null : (
		<Button
			transparent
			title="Offline"
			icon="cloud_off"
			className={bem("offline")}
			childrenClassName={bem("offline-span")}
		/>
	);
};

export default HeaderOfflineButton;
