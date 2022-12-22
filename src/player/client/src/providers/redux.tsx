import { FC, PropsWithChildren, createElement } from "react";
import { Provider } from "react-redux";

import { store } from "../redux";

export const ReduxProvider: FC<PropsWithChildren> = ({ children }) => (
	<Provider store={store}>{children}</Provider>
);
