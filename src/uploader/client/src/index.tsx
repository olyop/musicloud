// eslint-disable-next-line unicorn/prefer-node-protocol
import { Buffer } from "buffer";
import { StrictMode, createElement } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as ReactRouter } from "react-router-dom";

import Authentication from "./components/authentication";
import Footer from "./components/footer";
import Header from "./components/header";
import Pages from "./components/pages";

if (typeof window !== "undefined" && Buffer === undefined) {
	window.Buffer = Buffer;
}

const rootElement = document.getElementById("Root")!;

const root = createRoot(rootElement);

root.render(
	<StrictMode>
		<ReactRouter>
			<Authentication>
				<Header />
				<Pages />
				<Footer />
			</Authentication>
		</ReactRouter>
	</StrictMode>,
);
