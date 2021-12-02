import { useEffect, createElement, FC } from "react"
import { useFullScreenHandle, FullScreen as BaseFullscreen } from "react-full-screen"

import { useHasMounted } from "../../hooks"
import { useStateIsFullscreen } from "../../redux"

import "./index.scss"

const Fullscreen: FC = ({ children }) => {
	const hasMounted = useHasMounted()
	const fullscreen = useFullScreenHandle()
	const isFullscreen = useStateIsFullscreen()

	useEffect(() => {
		if (hasMounted) {
			if (isFullscreen) {
				void fullscreen.enter()
			} else {
				void fullscreen.exit()
			}
		}
	}, [isFullscreen])

	return (
		<BaseFullscreen className="Fullscreen" handle={fullscreen}>
			{children}
		</BaseFullscreen>
	)
}

export default Fullscreen