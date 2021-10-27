import isNull from "lodash/isNull"
import { configureStore } from "@reduxjs/toolkit"
import { useDispatch as internalUseDispatch } from "react-redux"

import reducer from "./reducer"
import { Settings } from "../types"
import { getJWT } from "../helpers"

const loadAccessToken =
	() => getJWT()

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
			settings: loadSettings(),
			accessToken: loadAccessToken(),
		},
		middleware:
			getDefaultMiddleware =>
				getDefaultMiddleware(),
	})

store.subscribe(() => {
	const { settings, accessToken } = store.getState()
	const serializedSettings = JSON.stringify(settings)
	localStorage.setItem("settings", serializedSettings)
	localStorage.setItem("authorization", isNull(accessToken) ? "null" : accessToken)
})

export type Dispatch =
	typeof store.dispatch

export const useDispatch =
	() => internalUseDispatch<Dispatch>()