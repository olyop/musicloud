import { createElement, useEffect, FC, Fragment } from "react"

import { useStateDoTransitions } from "../../redux"

const ApplySettings: FC = ({ children }) => {
	const doTransitions = useStateDoTransitions()

	useEffect(() => {
		document.documentElement.style.setProperty(
			"--transition-duration",
			doTransitions ? null : "0",
		)
	}, [doTransitions])

	return (
		<Fragment>
			{children}
		</Fragment>
	)
}

export default ApplySettings