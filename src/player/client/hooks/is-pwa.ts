declare global {
	interface Window {
		standalone: boolean,
	}
}

export const useIsPWA =
	() =>
		window.matchMedia("(display-mode: standalone)").matches ||
		document.referrer.includes("android-app://") ||
		window?.standalone === true