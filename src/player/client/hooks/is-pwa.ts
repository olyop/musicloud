declare global {
	interface Navigator {
		standalone: boolean,
	}
}

export const useIsPWA =
	() =>
		window.matchMedia("(display-mode: standalone)").matches ||
		document.referrer.includes("android-app://") ||
		window.navigator.standalone === true