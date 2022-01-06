import { createElement, useEffect, FC, Fragment } from "react"

import { useStateTransitions } from "../../redux"
import { SettingsTransitions } from "../../types"

const reducedValue =
	"0.1s"

const determineTransitionDuration =
	(transitions: SettingsTransitions): Parameters<CSSStyleDeclaration["setProperty"]>[1] => {
		switch (transitions) {
			case SettingsTransitions.ON:
				return null
			case SettingsTransitions.OFF:
				return "0"
			case SettingsTransitions.DEFAULT:
				return null
			case SettingsTransitions.REDUCED:
				return reducedValue
			case SettingsTransitions.SYSTEM:
				if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
					return reducedValue
				} else {
					return null
				}
			default:
				return null
		}
	}

const ApplySettings: FC = ({ children }) => {
	const transitions = useStateTransitions()

	useEffect(() => {
		document.documentElement.style.setProperty(
			"--transition-duration",
			determineTransitionDuration(transitions),
		)
	}, [transitions])

	return (
		<Fragment>
			{children}
		</Fragment>
	)
}

export default ApplySettings