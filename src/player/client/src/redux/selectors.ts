import { OrderBy, SettingsOrderBy } from "../types";
import { useSelector } from "./store";

export const useStatePlay = () => useSelector(({ play }) => play);

export const useStateSidebar = () => useSelector(({ sidebar }) => sidebar);

export const useStateIsOnline = () => useSelector(({ isOnline }) => isOnline);

export const useStateErrors = () => useSelector(({ errors }) => errors);

export const useStateLoading = () => useSelector(({ loading }) => loading);

export const useStateVolume = () => useSelector(({ settings: { volume } }) => volume);

export const useStateTheme = () => useSelector(({ settings: { theme } }) => theme);

export const useStatePageTitle = () => useSelector(({ pageTitle }) => pageTitle);

export const useStateListStyle = () => useSelector(({ settings: { listStyle } }) => listStyle);

export const useStateAccessToken = () => useSelector(({ accessToken }) => accessToken);

export const useStateShowGenres = () => useSelector(({ settings: { showGenres } }) => showGenres);

export const useStateTransitions = () =>
	useSelector(({ settings: { transitions } }) => transitions);

export const useStateShowReleased = () =>
	useSelector(({ settings: { showReleased } }) => showReleased);

export const useStateShowDuration = () =>
	useSelector(({ settings: { showDuration } }) => showDuration);

export const useStateGridChildWidth = () =>
	useSelector(({ settings: { gridChildWidth } }) => gridChildWidth);

export const useStateQueuesDisclosure = () =>
	useSelector(({ settings: { queuesDisclosure } }) => queuesDisclosure);

export const useStateOrderBy = <T = string>(key: keyof SettingsOrderBy) =>
	useSelector(({ settings: { orderBy } }) => orderBy[key] as unknown as OrderBy<T>);
