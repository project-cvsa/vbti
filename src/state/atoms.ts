import { atom } from "jotai";
import type { Answers, Screen } from "@/core/types";

export const currentScreenAtom = atom<Screen>("intro");

export const answersAtom = atom<Answers>({});

export const currentQuestionIndexAtom = atom(0);

export const answeredCountAtom = atom((get) => {
	const answers = get(answersAtom);
	return Object.keys(answers).length;
});

export const restartTestAtom = atom(null, (_get, set) => {
	set(answersAtom, {});
	set(currentQuestionIndexAtom, 0);
	set(currentScreenAtom, "test");
});

export const goToIntroAtom = atom(null, (_get, set) => {
	set(answersAtom, {});
	set(currentQuestionIndexAtom, 0);
	set(currentScreenAtom, "intro");
});

export const resultCharacterAtom = atom<string | null>(null);

export const secretResolvedAtom = atom(false);
