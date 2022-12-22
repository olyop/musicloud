import { FC, Fragment, PropsWithChildren, createElement, useEffect } from "react";

import { useStateGridChildWidth, useStateTheme, useStateTransitions } from "../../redux";
import applyGridChildWidth from "./apply-grid-child-width";
import applyTheme from "./apply-theme";
import applyTransitions from "./apply-transitions";

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
	const theme = useStateTheme();
	const transitions = useStateTransitions();
	const gridChildWidth = useStateGridChildWidth();

	useEffect(() => {
		applyTransitions(transitions);
	}, [transitions]);

	useEffect(() => {
		applyGridChildWidth(gridChildWidth);
	}, [gridChildWidth]);

	useEffect(() => {
		applyTheme(theme);
	}, [theme]);

	const handleApplyTheme = () => {
		applyTheme(theme);
	};

	useEffect(() => {
		window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handleApplyTheme);

		return window
			.matchMedia("(prefers-color-scheme: dark)")
			.removeEventListener("change", handleApplyTheme);
	}, []);

	return <Fragment>{children}</Fragment>;
};
