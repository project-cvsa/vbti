import { characters } from "@/data/characters";
import type {
	CharacterProbDistribution,
	CharLang,
} from "@/core/types";

type Dist = CharacterProbDistribution;

export const normalized = (_dist: Dist): Dist => {
	const sum = Object.values(_dist).reduce((acc, v) => acc + v, 0);

	if (sum === 0) return { ..._dist };

	return Object.fromEntries(Object.entries(_dist).map(([key, val]) => [key, val / sum]));
};

export const isAllZeroDist = (dist: Dist): boolean => {
	let result = true;
	for (const key in dist) {
		if (dist[key] !== 0) {
			result = false
		}
	}
	return result;
};

export const increaseLang = (lang: CharLang): ((_dist: Dist, weight: number) => Dist) => {
	return (_dist: Dist, weight: number) => {
		const dist = { ..._dist };
		for (const char in characters) {
			if (characters[char].lang === lang) {
				dist[char] *= weight;
			}
		}
		return normalized(dist);
	};
};

export const increaseCN = increaseLang("CN");
export const increaseJP = increaseLang("JP");

export const selectLang = (lang: CharLang): ((_dist: Dist) => Dist) => {
	return (_dist: Dist) => {
		const dist = { ..._dist };
		for (const char in characters) {
			if (characters[char].lang !== lang) {
				dist[char] = 0;
			}
		}
		if (isAllZeroDist(dist)) {
			// 避免造成空候选集
			return _dist;
		}
		return normalized(dist);
	};
};

export const selectCN = selectLang("CN");
export const selectJP = selectLang("JP");

export const increaseChar = (_dist: Dist, char: string, weight: number): Dist => {
	const dist = { ..._dist };
	dist[char] *= weight;
	return normalized(dist);
}


export const increaseChars = (_dist: Dist, chars: string[], weight: number): Dist => {
	let dist = { ..._dist };
	for (const char of chars) {
		dist = increaseChar(dist, char, weight);
	}
	return normalized(dist);
}
