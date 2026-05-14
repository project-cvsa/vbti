import { questions } from "@/data/questions";
import type { Dist, Answers } from "@/core/types";
import { increaseCN, increaseJP, normalized } from "../adjusters";
import { weightLang } from "./const";

export const adjustLangPref = (answers: Answers, _dist: Dist): Dist => {
	let dist = { ..._dist };

	// 对于特定问题的语言偏好调整
	// Q33和Q34的选项会直接强制删除对立语言的角色，在determineLang中处理
	for (const q of questions) {
		const ans = answers[q.id];
		if (q.id === "q33" || q.id === "q34") {
			continue;
		}
		if (ans === undefined) continue;
		const indices = Array.isArray(ans) ? ans : [ans];
		for (const idx of indices) {
			if (q.options[idx].lang === "CN") {
				dist = increaseCN(dist, weightLang);
			} else if (q.options[idx].lang === "JP") {
				dist = increaseJP(dist, weightLang);
			}
		}
	}

	return normalized(dist);
};
