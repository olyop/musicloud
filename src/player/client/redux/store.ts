import isNull from "lodash/isNull"
import { configureStore } from "@reduxjs/toolkit"
import { useDispatch as baseUseDispatch, useSelector as baseUseSelector } from "react-redux"

import reducer from "./reducer"
import { getJWT } from "../helpers"
import { Settings, State } from "../types"

const loadSettings =
	() => {
		const serializedState = localStorage.getItem("settings")
		return serializedState === null ?
			undefined : JSON.parse(serializedState) as Settings
	}

export const store =
	configureStore({
		reducer,
		preloadedState: {
			accessToken: getJWT(),
			settings: loadSettings(),
		},
		middleware:
			getDefaultMiddleware =>
				getDefaultMiddleware(),
	})

store.subscribe(() => {
	const { settings, accessToken } = store.getState()
	const serializedSettings = JSON.stringify(settings)
	localStorage.setItem("settings", serializedSettings)
	if (isNull(accessToken)) {
		localStorage.removeItem("authorization")
	} else {
		localStorage.setItem("authorization", accessToken)
	}
})

export type Dispatch =
	typeof store.dispatch

export const useDispatch =
	() => baseUseDispatch<Dispatch>()

type Selector<T> =
	(state: State) => T

export const useSelector =
	<T>(selector: Selector<T>) =>
		baseUseSelector<State, T>(selector)