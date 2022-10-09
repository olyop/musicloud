import { Provider } from "react-redux";
import { createElement, FC, PropsWithChildren } from "react";

import { store } from "../redux";

export const ReduxProvider: FC<PropsWithChildren> = ({ children }) => (
	<Provider store={store}>{children}</Provider>
);
