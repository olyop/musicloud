import { combineReducers, createReducer } from "@reduxjs/toolkit";

import { Settings, State } from "../types";
import {
	addError,
	addLoading,
	collapseQueuesDisclosure,
	expandQueuesDisclosure,
	removeError,
	removeLoading,
	togglePlay,
	toggleQueueDisclosure,
	toggleShowDuration,
	toggleShowGenres,
	toggleShowReleased,
	toggleSidebar,
	updateAccessToken,
	updateGridChildWidth,
	updateIsOnline,
	updateListStyle,
	updateOrderBy,
	updatePageTitle,
	updatePlay,
	updateTheme,
	updateTransitions,
	updateVolume,
} from "./actions";
import { initialState } from "./initial-state";

const sidebar = createReducer(initialState.sidebar, builder =>
	builder.addCase(toggleSidebar, state => !state),
);

const play = createReducer(initialState.play, builder =>
	builder.addCase(togglePlay, state => !state).addCase(updatePlay, (state, { payload }) => payload),
);

const isOnline = createReducer(initialState.isOnline, builder =>
	builder.addCase(updateIsOnline, (state, { payload }) => payload),
);

const errors = createReducer(initialState.errors, builder =>
	builder
		.addCase(addError, (state, { payload }) => [...state, payload])
		.addCase(removeError, (state, { payload }) =>
			state.filter(({ errorID }) => errorID !== payload),
		),
);

const loading = createReducer(initialState.loading, builder =>
	builder
		.addCase(addLoading, (state, { payload }) => [...state, payload])
		.addCase(removeLoading, (state, { payload }) => state.filter(x => x !== payload)),
);

const pageTitle = createReducer(initialState.pageTitle, builder =>
	builder.addCase(updatePageTitle, (state, { payload }) => payload),
);

const accessToken = createReducer(initialState.accessToken, builder =>
	builder.addCase(updateAccessToken, (state, { payload }) => payload),
);

const settings = createReducer<Settings>(initialState.settings, builder =>
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
		})),
);

const reducer = combineReducers<State>({
	play,
	errors,
	sidebar,
	loading,
	settings,
	isOnline,
	pageTitle,
	accessToken,
});

export default reducer;
