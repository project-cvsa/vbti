import { xoroshiro128plus } from "pure-rand/generator/xoroshiro128plus";
import { uniformFloat64 } from "pure-rand/distribution/uniformFloat64";
import type { Answers, Dist } from "./types";

function hashAnswers(answers: Answers): number {
	const ordered = Object.keys(answers)
		.sort()
		.map((k) => [k, answers[k]]);
	const s = JSON.stringify(ordered);
	let hash = 0;
	for (let i = 0; i < s.length; i++) {
		hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
	}
	return hash >>> 0;
}

export const sampleFromDist = (dist: Dist, answers: Answers): string => {
	const seed = hashAnswers(answers);
	const rng = xoroshiro128plus(seed);
	const random = uniformFloat64(rng);

	const entries = Object.entries(dist);
	let accumulator = 0;

	for (const [char, prob] of entries) {
		accumulator += prob;
		if (random <= accumulator) return char;
	}

	return entries[entries.length - 1][0];
};
