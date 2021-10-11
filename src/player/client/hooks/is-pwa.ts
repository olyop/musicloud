// declare global {
// 	interface Navigator {
// 		standalone: boolean,
// 	}
// }

export const useIsPWA =
	() =>
		document.referrer.includes("android-app://")
		// navigator.standalone === true ||
		// matchMedia("(display-mode: standalone)").matches