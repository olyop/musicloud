import { createElement, useEffect, FC, Fragment } from "react"

import { useStateTransitions } from "../../redux"
import { SettingsTransitions } from "../../types"

const determineTransitionValue =
	(transitions: SettingsTransitions): Parameters<CSSStyleDeclaration["setProperty"]>[1] => {
		switch (transitions) {
			case SettingsTransitions.ON:
				return null
			case SettingsTransitions.OFF:
				return "0"
			case SettingsTransitions.DEFAULT:
				return null
			case SettingsTransitions.REDUCED:
				return "0.1"
			case SettingsTransitions.SYSTEM: {
				const mediaQuery =
					window.matchMedia("(prefers-reduced-motion: reduce)")
				if (mediaQuery.matches) {
					return "0.1"
				} else {
					return null
				}
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
			determineTransitionValue(transitions),
		)
	}, [transitions])

	return (
		<Fragment>
			{children}
		</Fragment>
	)
}

export default ApplySettings