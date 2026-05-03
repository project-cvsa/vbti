import { questions } from "@/data/questions";
import type { Dist, Answers } from "@/core/types";
import { increaseChar, increaseChars, normalized } from "../adjusters";
import { weightChar as _weightChar } from "./const";

export const adjustCharacterPref = (answers: Answers, _dist: Dist, weightChar: number = _weightChar): Dist => {
	let dist = { ..._dist };

	// Q3: 角色偏好
	const ans3 = answers[questions[3].id];
	if (ans3.index === 0) {
		dist = increaseChar(dist, "乐正绫", weightChar);
	} else if (ans3.index === 1) {
		dist = increaseChar(dist, "GUMI", weightChar);
	} else if (ans3.index === 2) {
		dist = increaseChar(dist, "言和", weightChar);
	} else if (ans3.index === 3) {
		dist = increaseChar(dist, "巡音流歌", weightChar);
	}

	// Q4: 角色偏好
	const ans4 = answers[questions[4].id];
	if (ans4.index === 0) {
		dist = increaseChar(dist, "洛天依", weightChar);
	} else if (ans4.index === 1) {
		dist = increaseChar(dist, "GUMI", weightChar);
	} else if (ans4.index === 2) {
		dist = increaseChar(dist, "可不", weightChar);
	} else if (ans4.index === 3) {
		dist = increaseChar(dist, "乐正绫", weightChar);
	}

	// Q5: 角色偏好
	const ans5 = answers[questions[5].id];
	if (ans5.index === 2) {
		dist = increaseChar(dist, "初音未来", weightChar);
	}

	// Q10: 特定条件 → 重音Teto
	const ans10 = answers[questions[10].id];
	if (ans10.index === 2) {
		dist = increaseChar(dist, "重音Teto", 1.3);
	}

	const ans39 = answers[questions[39].id];
	if (ans39.index === 0) {
		// 元气
		dist = increaseChars(dist, ["乐正绫", "音街鳗", "镜音铃"], weightChar);
	} else if (ans39.index === 1) {
		// 温柔治愈
		dist = increaseChars(dist, ["GUMI", "IA", "东方栀子", "KAITO"], weightChar);
	} else if (ans39.index === 3) {
		// 可爱
		dist = increaseChars(dist, ["海伊", "诗岸", "俊达萌"], weightChar);
	}

	return normalized(dist);
};
