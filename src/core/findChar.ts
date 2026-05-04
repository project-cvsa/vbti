import { characters } from "@/data/characters";
import type { Dist, Answers } from "@/core/types";
import { questions } from "@/data/questions";
import { computeMBTI } from "./mbti";
import { adjustMBTI } from "./specials/mbti";
import { adjustLangPref } from "./specials/langPref";
import { determineLang } from "./specials/determineLang";
import { adjustCharacterPref } from "./specials/charPref";
import { weightChar, weightMbti } from "./specials/const";
import { adjustPopularity } from "./specials/popularity";
import { sampleFromDist } from "./sample";

const initalDistribution: Dist = Object.fromEntries(
	Object.keys(characters).map((char) => [char, 1 / Object.keys(characters).length])
);

export function findMatchCharacterRaw(answers: Answers): [string, Dist] {
	const mbti = computeMBTI(answers);
	let dist = initalDistribution;
	const ans0 = answers[questions[0].id];
	// 第0题选择“性格越像我越好！最好和我本人的mbti一致”
	if (ans0 === 0) {
		dist = adjustMBTI(mbti, dist);
		dist = adjustLangPref(answers, dist);
		dist = determineLang(answers, dist);
	}
	// 第0题选择“和我爱听的术力口一致，是自推那更好啦~”
	else if (ans0 === 1) {
		dist = adjustCharacterPref(answers, dist, weightChar);
		dist = adjustLangPref(answers, dist);
		dist = determineLang(answers, dist);
		dist = adjustMBTI(mbti, dist, 10); // 略微调整一下MBTI
	}
	// 第0题选择“越冷门越特别！我就想看看小众或者之前不认识的！”
	else if (ans0 === 2) {
		dist = adjustCharacterPref(answers, dist, 0.2);
		// 增强冷门角色
		dist = adjustPopularity(dist, -1.5);
		dist = adjustLangPref(answers, dist);
		dist = determineLang(answers, dist);
		dist = adjustMBTI(mbti, dist, 5); // 略微调整一下MBTI
	}
	// 随便->这种最难猜了，给一个通用的
	else {
		dist = adjustMBTI(mbti, dist, weightMbti * 100);
		dist = adjustCharacterPref(answers, dist, weightChar / 15);
		dist = adjustLangPref(answers, dist);
		dist = determineLang(answers, dist);
		// 稍微增强热门角色
		dist = adjustPopularity(dist, 0.3);
	}
	return [sampleFromDist(dist, answers), dist];
}

export const findMatchCharacter = (answers: Answers): string => {
	return findMatchCharacterRaw(answers)[0];
};
