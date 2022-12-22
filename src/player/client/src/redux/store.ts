import { configureStore } from "@reduxjs/toolkit";
import isEmpty from "lodash-es/isEmpty";
import isNull from "lodash-es/isNull";
import last from "lodash-es/last";
import { useDispatch as baseUseDispatch, useSelector as baseUseSelector } from "react-redux";

import { getJWT } from "../helpers";
import { Settings, State } from "../types";
import { removeError } from "./actions";
import reducer from "./reducer";

const loadSettings = () => {
	const settingsString = localStorage.getItem("settings");
	if (isNull(settingsString)) {
		return undefined;
	} else {
		return JSON.parse(settingsString) as Settings;
	}
};

export const store = configureStore({
	reducer,
	preloadedState: {
		accessToken: getJWT(),
		settings: loadSettings(),
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

store.subscribe(() => {
	const { settings, accessToken, errors } = store.getState();

	const serializedSettings = JSON.stringify(settings);

	localStorage.setItem("settings", serializedSettings);

	if (isNull(accessToken)) {
		localStorage.removeItem("authorization");
	} else {
		localStorage.setItem("authorization", accessToken);
	}

	if (!isEmpty(errors)) {
		setTimeout(() => {
			store.dispatch(removeError(last(errors)!.errorID));
		}, 2500);
	}
});

export const { dispatch } = store;

export type Dispatch = typeof dispatch;

export const useDispatch = () => baseUseDispatch<Dispatch>();

type Selector<T> = (state: State) => T;

export const useSelector = <T>(selector: Selector<T>) => baseUseSelector<State, T>(selector);
