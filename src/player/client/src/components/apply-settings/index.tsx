import { createElement, useEffect, FC, Fragment, PropsWithChildren } from "react"

import {
	useStateTheme,
	useStateTransitions,
	useStateGridChildWidth,
} from "../../redux"

import applyTheme from "./apply-theme"
import applyTransitions from "./apply-transitions"
import applyGridChildWidth from "./apply-grid-child-width"

const ApplySettings: FC<PropsWithChildren> = ({ children }) => {
	const theme = useStateTheme()
	const transitions = useStateTransitions()
	const gridChildWidth = useStateGridChildWidth()

	useEffect(() => {
		applyTransitions(transitions)
	}, [transitions])

	useEffect(() => {
		applyGridChildWidth(gridChildWidth)
	}, [gridChildWidth])

	useEffect(() => {
		applyTheme(theme)
	}, [theme])

	useEffect(() => {
		window.matchMedia("(prefers-color-scheme: dark)")
			.addEventListener("change", () => {
				applyTheme(theme)
			})

		return (
			window.matchMedia("(prefers-color-scheme: dark)")
				.removeEventListener("change", () => applyTheme(theme))
		)
	}, [])

	return (
		<Fragment>
			{children}
		</Fragment>
	)
}

export default ApplySettings