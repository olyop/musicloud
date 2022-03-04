import { createContext as createCtx, useContext } from "react"

export const createContext =
	<T extends unknown | null>() => {
		const ctx = createCtx<T | undefined>(undefined)
		function useCtx() {
			const context = useContext(ctx)
			if (context === undefined) {
				throw new Error("useCtx must be inside a Provider with a value")
			} else {
				return context
			}
		}
		return [ useCtx, ctx.Provider ] as const
	}