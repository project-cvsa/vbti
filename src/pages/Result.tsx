import AppShell from "@/components/layout/AppShell";
import ResultScreen from "@/components/screens/ResultScreen";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { resultCharacterAtom } from "@/state/atoms";

export function Result() {
	let { character } = useParams();
	const setCharacter = useSetAtom(resultCharacterAtom);

	useEffect(() => {
		setCharacter(character ?? null);
	}, [setCharacter, character]);

	return (
		<AppShell>
			<ResultScreen />
		</AppShell>
	);
}
