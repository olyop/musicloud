import { useSelector } from "react-redux"

import {
	State,
	OrderBy,
	SettingsTheme,
	SettingsOrderBy,
	SettingsListStyle,
	SettingsQueuesDisclosure,
} from "../types"

export const useStatePlay =
	() => useSelector<State, boolean>(
		({ play }) => play,
	)

export const useStateSidebar =
	() => useSelector<State, boolean>(
		({ sidebar }) => sidebar,
	)

export const useStateCurrent =
	() => useSelector<State, number>(
		({ current }) => current,
	)

export const useStateLoading =
	() => useSelector<State, string[]>(
		({ loading }) => loading,
	)

export const useStateIsOnline =
	() => useSelector<State, boolean>(
		({ isOnline }) => isOnline,
	)

export const useStateTheme =
	() => useSelector<State, SettingsTheme>(
		({ settings: { theme } }) => theme,
	)

export const useStateVolume =
	() => useSelector<State, number>(
		({ settings: { volume } }) => volume,
	)

export const useStateListStyle =
	() => useSelector<State, SettingsListStyle>(
		({ settings: { listStyle } }) => listStyle,
	)

export const useStateShowGenres =
	() => useSelector<State, boolean>(
		({ settings: { showGenres } }) => showGenres,
	)

export const useStateShowReleased =
	() => useSelector<State, boolean>(
		({ settings: { showReleased } }) => showReleased,
	)

export const useStateShowDuration =
	() => useSelector<State, boolean>(
		({ settings: { showDuration } }) => showDuration,
	)

export const useStateQueuesDisclosure =
	() => useSelector<State, SettingsQueuesDisclosure>(
		({ settings: { queuesDisclosure } }) => queuesDisclosure,
	)

export const useStateOrderBy =
	<T = string>(key: keyof SettingsOrderBy) =>
		useSelector<State, OrderBy<T>>(
			({ settings: { orderBy } }) => (
				(orderBy[key] as unknown) as OrderBy<T>
			),
		)