import type { Dist } from "./types";

export const sampleFromDist = (dist: Dist): string => {
	const random = Math.random();
	const entries = Object.entries(dist);
	let accumulator = 0;

	for (const [char, prob] of entries) {
		accumulator += prob;
		if (random <= accumulator) return char;
	}

	return entries[entries.length - 1][0];
};
