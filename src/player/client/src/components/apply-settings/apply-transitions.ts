import { SettingsTransitions } from "../../types"

const determineTransitionsDuration =
	(transitions: SettingsTransitions): Parameters<CSSStyleDeclaration["setProperty"]>[1] => {
		switch (transitions) {
			case SettingsTransitions.ON:
				return null
			case SettingsTransitions.OFF:
				return "0"
			case SettingsTransitions.DEFAULT:
				return null
			case SettingsTransitions.REDUCED:
				return "0.1s"
			case SettingsTransitions.SYSTEM:
				if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
					return "0.1s"
				} else {
					return null
				}
			default:
				return null
		}
	}

const applyTransitions =
	(transitions: SettingsTransitions) => {
		document.documentElement.style.setProperty(
			"--transition-duration",
			determineTransitionsDuration(transitions),
		)
	}

export default applyTransitions