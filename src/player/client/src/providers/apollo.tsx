import { ApolloProvider as ApolloBaseProvider } from "@apollo/client";
import { FC, PropsWithChildren, createElement } from "react";

import apollo from "../apollo";

export const ApolloProvider: FC<PropsWithChildren> = ({ children }) => (
	<ApolloBaseProvider client={apollo}>{children}</ApolloBaseProvider>
);
