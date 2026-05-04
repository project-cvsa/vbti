import type { Dist, MBTIResult } from "@/core/types";
import { characters } from "@/data/characters";
import { normalized } from "../adjusters";
import { weightMbti as _weightMbti } from "./const";

function countUniqueCommonChars(str1: string, str2: string) {
	const set1 = new Set(str1);
	const set2 = new Set(str2);
	let count = 0;

	for (let char of set1) {
		if (set2.has(char)) {
			count++;
		}
	}
	return count;
}

export const adjustMBTI = (
	mbti: MBTIResult,
	_dist: Dist,
	weightMbti: number = _weightMbti
): Dist => {
	let dist = { ..._dist };
	for (const char in characters) {
		const charMbti = characters[char].mbti;
		const userMbti = mbti.mbti;
		if (charMbti === userMbti) {
			dist[char] *= weightMbti;
		} else {
			const c = countUniqueCommonChars(charMbti, userMbti);
			if (c !== 0) {
				dist[char] *= weightMbti / 4;
			}
		}
	}
	return normalized(dist);
};
