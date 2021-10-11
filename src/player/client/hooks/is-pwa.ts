export const useIsPWA =
	() =>
		window.matchMedia("(display-mode: standalone)").matches