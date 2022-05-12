import { createContext } from "react"

const ScrollElementContext =
	createContext<HTMLElement | null>(null)

export default ScrollElementContext