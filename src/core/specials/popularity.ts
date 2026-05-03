import type { Dist } from "@/core/types";
import { normalized } from "../adjusters";
import { characters } from "@/data/characters";

/**
 * 根据期望得到冷/热门角色的偏好调整概率分布
 * @param _dist 原始的概率分布
 * @param weight 权重，正值为增强热门角色，负值为增强冷门角色
 * @returns 调整后的概率分布
 */
 export const adjustPopularity = (_dist: Dist, weight: number): Dist => {
	let dist = { ..._dist };
 
	for (const char in characters) {
		const character = characters[char];
		const p = character.popularity;
		if (p === undefined || p === null) continue;

		// >60 为热门；反之为冷门
		let normalizedPopularity: number;
		if (p <= 60) {
			normalizedPopularity = (p - 60) / 60;
		} else {
			normalizedPopularity = (p - 60) / 40;
		}
 
		const factor = 1 + weight * normalizedPopularity;
		dist[char] = (dist[char] ?? 0) * Math.max(factor, 0.1);
	}
 
	return normalized(dist);
 };