import { createElement, FC, PropsWithChildren } from "react";
import { ApolloProvider as ApolloBaseProvider } from "@apollo/client";

import apollo from "../apollo";

export const ApolloProvider: FC<PropsWithChildren> = ({ children }) => (
	<ApolloBaseProvider client={apollo}>{children}</ApolloBaseProvider>
);
