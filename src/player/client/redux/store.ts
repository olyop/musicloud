import { configureStore } from "@reduxjs/toolkit"
import { useDispatch as internalUseDispatch } from "react-redux"

import reducer from "./reducer"
import { Settings } from "../types"

const loadState =
	() => {
		const serializedState = localStorage.getItem("settings")
		return serializedState === null ?
			undefined : JSON.parse(serializedState) as Settings
	}

export const store =
	configureStore({
		reducer,
		preloadedState: {
			settings: loadState(),
		},
		middleware:
			getDefaultMiddleware =>
				getDefaultMiddleware({
					serializableCheck: {
						ignoredActions: ["CHANGE_MODAL", "CLEAR_MODAL"],
					},
				}),
	})

store.subscribe(() => {
	const { settings } = store.getState()
	const serializedSettings = JSON.stringify(settings)
	localStorage.setItem("settings", serializedSettings)
})

export type Dispatch =
	typeof store.dispatch

export const useDispatch =
	() => internalUseDispatch<Dispatch>()