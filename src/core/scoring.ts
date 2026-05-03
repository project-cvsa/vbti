import { questions } from "@/data/questions";
import { characters } from "@/data/characters";
import type { Answer, MBTIScores, MBTIResult, Character } from "@/core/types";

const doubleWeightIds = [
	"q1",
	"q2",
	"q8",
	"q13",
	"q14",
	"q18",
	"q23",
	"q27",
	"q31",
	"q35",
	"q38",
	"q39",
];

const emptyScores = (): MBTIScores => ({
	E: 0,
	I: 0,
	S: 0,
	N: 0,
	T: 0,
	F: 0,
	J: 0,
	P: 0,
});

export function computeMBTI(answers: Record<string, Answer>): MBTIResult {
	const scores = emptyScores();
	let cnScore = 0;
	let jpScore = 0;

	for (const q of questions) {
		const ans = answers[q.id];
		if (!ans) continue;

		const val = ans.value;
		let weight = 1;
		if (doubleWeightIds.includes(q.id)) weight = 2;

		if (q.id === "q39") {
			const opt = q.options.find((o) => o.value === val);
			if (opt?.weight != null) weight = opt.weight;
		}

		const chosenOpt = q.options.find((o) => o.value === val);
		if (chosenOpt) {
			if (chosenOpt.lang === "CN") cnScore += weight;
			if (chosenOpt.lang === "JP") jpScore += weight;
			if (chosenOpt.isCN) cnScore += weight;
			if (chosenOpt.isJP) jpScore += weight;
		}

		if (Object.hasOwn(scores, val)) {
			scores[val as keyof MBTIScores] += weight;
		}
	}

	const mbti =
		(scores.E >= scores.I ? "E" : "I") +
		(scores.S >= scores.N ? "S" : "N") +
		(scores.T >= scores.F ? "T" : "F") +
		(scores.J >= scores.P ? "J" : "P");

	return { scores, mbti, cnScore, jpScore };
}

export function getCandidates(mbti: string, preferLang: "CN" | "JP" | null): string[] {
	const all = Object.entries(characters)
		.filter(([_, c]) => c.mbti === mbti)
		.map(([name]) => name);

	if (!preferLang) return all;

	const filtered = all.filter((name) => characters[name].lang === preferLang);
	return filtered.length > 0 ? filtered : all;
}

export function computeDistance(userScores: MBTIScores, character: Character): number {
	const userVector = [
		userScores.E - userScores.I,
		userScores.N - userScores.S,
		userScores.F - userScores.T,
		userScores.P - userScores.J,
	];
	const charVector = [character.ie - 50, character.ns - 50, character.ft - 50, character.pj - 50];

	let dist = 0;
	for (let i = 0; i < 4; i++) {
		dist += (userVector[i] - charVector[i]) ** 2;
	}
	dist = Math.sqrt(dist);
	dist -= character.weight * 1.5;
	return dist;
}

export function findMatchCharacter(candidates: string[], scores: MBTIScores): string {
	let bestMatch: string | null = null;
	let bestScore = Number.POSITIVE_INFINITY;

	for (const name of candidates) {
		const c = characters[name];
		if (!c) continue;
		const dist = computeDistance(scores, c);
		if (dist < bestScore) {
			bestScore = dist;
			bestMatch = name;
		}
	}

	return bestMatch ?? candidates[0];
}
