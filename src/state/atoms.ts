import { atom } from "jotai";
import type { Answer, Screen } from "@/core/types";

export const currentScreenAtom = atom<Screen>("intro");

export const answersAtom = atom<Record<string, Answer>>({});

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
