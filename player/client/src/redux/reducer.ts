import {
	createReducer,
	combineReducers,
} from "@reduxjs/toolkit"

import {
	addLoading,
	updatePlay,
	togglePlay,
	updateTheme,
	updateVolume,
	removeLoading,
	updateCurrent,
	updateOrderBy,
	toggleSidebar,
	updateIsOnline,
	updateListStyle,
	toggleShowGenres,
	updateTransitions,
	updateAccessToken,
	toggleShowReleased,
	toggleShowDuration,
	updateGridChildWidth,
	toggleQueueDisclosure,
	expandQueuesDisclosure,
	collapseQueuesDisclosure,
} from "./actions"

import { State, Settings } from "../types"
import { initialState } from "./initial-state"

const sidebar =
	createReducer(initialState.sidebar, builder =>
		builder
			.addCase(toggleSidebar, state => !state))

const current =
	createReducer(initialState.current, builder =>
		builder
			.addCase(updateCurrent, (_state, { payload }) => payload))

const play =
	createReducer(initialState.play, builder =>
		builder
			.addCase(togglePlay, state => !state)
			.addCase(updatePlay, (_state, { payload }) => payload))

const isOnline =
	createReducer(initialState.isOnline, builder =>
		builder
			.addCase(updateIsOnline, (_state, { payload }) => payload))

const loading =
	createReducer(initialState.loading, builder =>
		builder
			.addCase(addLoading, (state, { payload }) => [ ...state, payload ])
			.addCase(removeLoading, (state, { payload }) => (
				state.filter(x => x !== payload)
			)))

const accessToken =
	createReducer(initialState.accessToken, builder =>
		builder
			.addCase(updateAccessToken, (_state, { payload }) => payload))

const settings =
	createReducer<Settings>(initialState.settings, builder =>
		builder
			.addCase(updateVolume, (state, { payload }) => ({
				...state,
				volume: payload,
			}))
			.addCase(toggleShowGenres, state => ({
				...state,
				showGenres: !state.showGenres,
			}))
			.addCase(toggleShowReleased, state => ({
				...state,
				showReleased: !state.showReleased,
			}))
			.addCase(toggleShowDuration, state => ({
				...state,
				showDuration: !state.showDuration,
			}))
			.addCase(updateTheme, (state, { payload }) => ({
				...state,
				theme: payload,
			}))
			.addCase(updateListStyle, (state, { payload }) => ({
				...state,
				listStyle: payload,
			}))
			.addCase(updateTransitions, (state, { payload }) => ({
				...state,
				transitions: payload,
			}))
			.addCase(updateGridChildWidth, (state, { payload }) => ({
				...state,
				gridChildWidth: payload,
			}))
			.addCase(updateOrderBy, (state, { payload }) => ({
				...state,
				orderBy: {
					...state.orderBy,
					[payload.settingsKey]: {
						...state.orderBy[payload.settingsKey],
						[payload.key]: payload.value,
					},
				},
			}))
			.addCase(expandQueuesDisclosure, state => ({
				...state,
				queuesDisclosure: {
					...state.queuesDisclosure,
					next: true,
					later: true,
				},
			}))
			.addCase(collapseQueuesDisclosure, state => ({
				...state,
				queuesDisclosure: {
					next: false,
					later: false,
					previous: false,
				},
			}))
			.addCase(toggleQueueDisclosure, (state, { payload }) => ({
				...state,
				queuesDisclosure: {
					...state.queuesDisclosure,
					[payload]: !state.queuesDisclosure[payload],
				},
			})))

const reducer =
	combineReducers<State>({
		play,
		current,
		sidebar,
		loading,
		settings,
		isOnline,
		accessToken,
	})

export default reducer