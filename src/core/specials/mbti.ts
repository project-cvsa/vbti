import type { Dist, MBTIResult } from "@/core/types";
import { characters } from "@/data/characters";
import { normalized } from "../adjusters";
import { weightMbti } from "./const";

export const adjustMBTI = (mbti: MBTIResult, _dist: Dist): Dist => {
	let dist = { ..._dist };
	for (const char in characters) {
		if (characters[char].mbti === mbti.mbti) {
			dist[char] *= weightMbti;
		}
	}
	return normalized(dist);
};