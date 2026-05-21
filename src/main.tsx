import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import { Result } from "./pages/Result.tsx";
import { Toaster } from "@/components/ui/sonner";
import { onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { report } from "./lib/telemetry.ts";
import { isDev } from "./lib/utils.ts";

function sendToAnalytics(metric: Metric) {
	const body = {
		name: metric.name,
		value: metric.value,
		id: metric.id,
	};

	console.log(body);

	report("performance_report", body)
}

onTTFB(sendToAnalytics);
onFCP(sendToAnalytics);
onLCP(sendToAnalytics);

console.log(isDev);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Toaster />
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				{isDev && <Route path="/result/:character" element={<Result />} />}
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
