import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import { Result } from "./pages/Result.tsx";

const isDev = import.meta.env.DEV;

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/dev" element={<App />} />
				{isDev && <Route path="/result/:character" element={<Result />} />}
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
