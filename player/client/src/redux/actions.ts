import {
	createAction,
} from "@reduxjs/toolkit"

import {
	OrderBy,
	SettingsTheme,
	StatePageTitle,
	SettingsOrderBy,
	SettingsListStyle,
	SettingsTransitions,
	SettingsQueuesDisclosure,
} from "../types"

interface OrderByPayload {
	value: string,
	key: keyof OrderBy,
	settingsKey: keyof SettingsOrderBy,
}

export const togglePlay =
	createAction("TOGGLE_PLAY")

export const toggleSidebar =
	createAction("TOGGLE_SIDEBAR")

export const toggleShowGenres =
	createAction("TOGGLE_SHOW_GENRES")

export const toggleShowReleased =
	createAction("TOGGLE_SHOW_RELEASED")

export const toggleShowDuration =
	createAction("TOGGLE_SHOW_DURATION")

export const expandQueuesDisclosure =
	createAction("EXPAND_QUEUES_DISCLOSURE")

export const collapseQueuesDisclosure =
	createAction("COLLAPSE_QUEUES_DISCLOSURE")

const withPayloadType =
	<T>() =>
		(payload: T) =>
			({ payload })

export const updateVolume =
	createAction(
		"UPDATE_VOLUME",
		withPayloadType<number>(),
	)
export const removeLoading =
	createAction(
		"REMOVE_LOADING",
		withPayloadType<string>(),
	)

export const addLoading =
	createAction(
		"ADD_LOADING",
		withPayloadType<string>(),
	)

export const updatePlay =
	createAction(
		"UPDATE_PLAY",
		withPayloadType<boolean>(),
	)
export const updateIsOnline =
	createAction(
		"UPDATE_IS_ONLINE",
		withPayloadType<boolean>(),
	)

export const updateGridChildWidth =
	createAction(
		"UPDATE_GRID_CHILD_WIDTH",
		withPayloadType<number>(),
	)

export const updatePageTitle =
	createAction(
		"UPDATE_PAGE_TITLE",
		withPayloadType<StatePageTitle>(),
	)

export const updateAccessToken =
	createAction(
		"UPDATE_ACCESS_TOKEN",
		withPayloadType<string | null>(),
	)

export const updateTheme =
	createAction(
		"UPDATE_THEME",
		withPayloadType<SettingsTheme>(),
	)

export const updateOrderBy =
	createAction(
		"UPDATE_ORDER_BY",
		withPayloadType<OrderByPayload>(),
	)

export const updateListStyle =
	createAction(
		"UPDATE_LIST_STYLE",
		withPayloadType<SettingsListStyle>(),
	)

export const updateTransitions =
	createAction(
		"UPDATE_TRANSITIONS",
		withPayloadType<SettingsTransitions>(),
	)

export const toggleQueueDisclosure =
	createAction(
		"TOGGLE_QUEUE_DISCLOSURE",
		withPayloadType<keyof SettingsQueuesDisclosure>(),
	)