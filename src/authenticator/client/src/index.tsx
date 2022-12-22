import { StrictMode, createElement } from "react";
import { createRoot } from "react-dom/client";

import Application from "./application";

const rootElement = document.getElementById("Root")!;

const root = createRoot(rootElement);

root.render(
	<StrictMode>
		<Application />
	</StrictMode>,
);
