import { createNoise4D } from "./noise";
import type { Dist, MBTIResult } from "./types";

/**
 * 根据概率分布和 MBTI 向量进行确定性采样
 * @param dist 归一化后的概率分布，key 为角色名，value 为概率
 * @param mbti MBTI 计算结果
 * @param noiseSeed 噪声种子（可选，用于全局区分不同批次的采样）
 * @returns 选中的角色名
 */
export const sampleFromDist = (
	dist: Dist,
	mbti: MBTIResult,
	noiseSeed?: number
): string => {
	const noise4D = createNoise4D(noiseSeed);
	const [e, s, t, j] = mbti.vector;

	// 将 MBTI 向量输入噪声函数，得到 [-1, 1] 范围内的确定性伪随机数
	const noiseValue = noise4D(e, s, t, j);

	// 将 [-1, 1] 映射到 [0, 1]
	const random = (noiseValue + 1) / 2;

	// 构建累积分布函数 (CDF)
	const entries = Object.entries(dist);
	let accumulator = 0;
	const cdf: { char: string; threshold: number }[] = [];

	for (const [char, prob] of entries) {
		accumulator += prob;
		cdf.push({ char, threshold: accumulator });
	}

	// 从 CDF 中采样：找到 random 落在哪个区间
	for (const { char, threshold } of cdf) {
		if (random <= threshold) {
			return char;
		}
	}

	// 兜底：如果因为浮点精度问题没找到，返回最后一个角色
	return cdf[cdf.length - 1].char;
};