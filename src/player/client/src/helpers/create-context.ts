import { createContext as createBaseContext, useContext } from "react";

export const createContext = <T extends unknown | null>() => {
	const baseContext = createBaseContext<T | undefined>(undefined);
	// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
	function useBaseContext() {
		const context = useContext(baseContext);
		if (context === undefined) {
			throw new Error("useCtx must be inside a Provider with a value");
		} else {
			return context;
		}
	}
	return [useBaseContext, baseContext.Provider] as const;
};
