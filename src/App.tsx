import { useAtomValue } from "jotai";
import { currentScreenAtom } from "@/state/atoms";
import AppShell from "@/components/layout/AppShell";
import BgmControl from "@/components/layout/BgmControl";
import IntroScreen from "@/components/screens/IntroScreen";
import TestScreen from "@/components/screens/TestScreen";
import ResultScreen from "@/components/screens/ResultScreen";

function App() {
	const currentScreen = useAtomValue(currentScreenAtom);

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
