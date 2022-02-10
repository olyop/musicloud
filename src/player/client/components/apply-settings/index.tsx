import { createElement, useEffect, FC, Fragment } from "react"

import { SettingsTransitions } from "../../types"
import { useStateGridChildWidth, useStateTransitions } from "../../redux"

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
	const gridChildWidth = useStateGridChildWidth()

	useEffect(() => {
		document.documentElement.style.setProperty(
			"--transition-duration",
			determineTransitionDuration(transitions),
		)
	}, [transitions])

	useEffect(() => {
		document.documentElement.style.setProperty(
			"--grid-child-width",
			`${gridChildWidth.toString()}rem`,
		)
	}, [gridChildWidth])

	return (
		<Fragment>
			{children}
		</Fragment>
	)
}

export default ApplySettings