import { useSelector } from "./store"
import { OrderBy, SettingsOrderBy } from "../types"

export const useStateCurrent =
() => useSelector(
	({ current }) => current,
)

export const useStatePlay =
	() => useSelector(
		({ play }) => play,
	)

export const useStateSidebar =
	() => useSelector(
		({ sidebar }) => sidebar,
	)

export const useStateIsOnline =
	() => useSelector(
		({ isOnline }) => isOnline,
	)

export const useStateLoading =
	() => useSelector(
		({ loading }) => loading,
	)

export const useStateIsFullscreen =
	() => useSelector(
		({ isFullscreen }) => isFullscreen,
	)

export const useStateVolume =
	() => useSelector(
		({ settings: { volume } }) => volume,
	)

export const useStateTheme =
	() => useSelector(
		({ settings: { theme } }) => theme,
	)

export const useStateListStyle =
	() => useSelector(
		({ settings: { listStyle } }) => listStyle,
	)

export const useStateAccessToken =
	() => useSelector(
		({ accessToken }) => accessToken,
	)

export const useStateShowGenres =
	() => useSelector(
		({ settings: { showGenres } }) => showGenres,
	)

export const useStateShowReleased =
	() => useSelector(
		({ settings: { showReleased } }) => showReleased,
	)

export const useStateDoTransitions =
	() => useSelector(
		({ settings: { doTransitions } }) => doTransitions,
	)

export const useStateShowDuration =
	() => useSelector(
		({ settings: { showDuration } }) => showDuration,
	)

export const useStateQueuesDisclosure =
	() => useSelector(
		({ settings: { queuesDisclosure } }) => queuesDisclosure,
	)

export const useStateOrderBy =
	<T = string>(key: keyof SettingsOrderBy) =>
		useSelector(
			({ settings: { orderBy } }) => (
				(orderBy[key] as unknown) as OrderBy<T>
			),
		)