import { atom } from "jotai";
import type { Answers, CharacterProbDistribution, Screen } from "@/core/types";
import { findMatchCharacterRaw } from "@/core/findChar";
import { questions } from "@/data/questions";
import { characters } from "@/data/characters";
import { generateResultPalette, type ResultPalette } from "@/core/color";

export const currentScreenAtom = atom<Screen>("intro");

export const answersAtom = atom<Answers>({});

export const currentQuestionIndexAtom = atom(0);

export const answeredCountAtom = atom((get) => {
	const answers = get(answersAtom);
	return Object.keys(answers).length;
});

export const unansweredAtom = atom((get) => {
	const answers = get(answersAtom);
	const unanswered = [];
	for (let i = 0; i < questions.length; i += 1) {
		const q = questions[i];
		const ans = answers[q.id];
		if (ans === undefined || (Array.isArray(ans) && ans.length === 0)) {
			unanswered.push(i);
		}
	}
	return unanswered;
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

export const probDistAtom = atom<CharacterProbDistribution | null>((get) => {
	const answers = get(answersAtom);
	if (Object.keys(answers).length === 0) return null;
	return findMatchCharacterRaw(answers)[1];
});

// null 代表无法生成指纹，undefined代表未设置
export const fingerprintAtom = atom<string | null | undefined>(undefined);

export const resultPaletteAtom = atom<ResultPalette | null>((get) => {
	const resultCharacter = get(resultCharacterAtom);
	if (!resultCharacter) return null;
	const character = characters[resultCharacter];
	if (!character?.color) return null;
	return generateResultPalette(character.color);
});