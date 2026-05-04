import { useAtom, useAtomValue } from "jotai";
import { currentScreenAtom, fingerprintAtom } from "@/state/atoms";
import AppShell from "@/components/layout/AppShell";
import BgmControl from "@/components/layout/BgmControl";
import IntroScreen from "@/components/screens/IntroScreen";
import TestScreen from "@/components/screens/TestScreen";
import ResultScreen from "@/components/screens/ResultScreen";
import { useEffect } from "react";
import { Thumbmark } from "@thumbmarkjs/thumbmarkjs";

function App() {
	const currentScreen = useAtomValue(currentScreenAtom);
	const [thumbmark, setThumbmark] = useAtom(fingerprintAtom);

	useEffect(() => {
		const tm = new Thumbmark();
		tm.get()
			.then((result) => {
				setThumbmark(result.thumbmark);
			})
			.catch((error) => {
				console.error("Error getting fingerprint:", error);
				setThumbmark(null);
			});
	}, [setThumbmark]);

	useEffect(() => {
		if (thumbmark === undefined) return;
		const data = {
			actionType: "onboard",
			actionData: null,
			fingerprint: thumbmark,
			mode: import.meta.env.MODE
		};
		const url = new URL(import.meta.env.VITE_BACKEND_URL);
		url.pathname = "/access";
		fetch(url, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		});
	}, [thumbmark]);

	return (
		<>
			<AppShell>
				{currentScreen === "intro" && <IntroScreen />}
				{currentScreen === "test" && <TestScreen />}
				{currentScreen === "result" && <ResultScreen />}
			</AppShell>
			<BgmControl visible={currentScreen !== "result"} />
			<audio id="globalBgm" src="bgm/bgm.mp3" loop hidden />
		</>
	);
}

export default App;
