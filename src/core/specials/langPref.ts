import { questions } from "@/data/questions";
import type { Dist, Answers } from "@/core/types";
import { increaseCN, increaseJP, normalized } from "../adjusters";
import { weightLang } from "./const";

export const adjustLangPref = (answers: Answers, _dist: Dist): Dist => {
	let dist = { ..._dist };

	for (const q of questions) {
		const ans = answers[q.id]
		if (q.id === "q33" || q.id === "q34") {
			continue;
		}
		if (q.options[ans.index].lang === 'CN') {
			dist = increaseCN(dist, weightLang);
		}
		else if (q.options[ans.index].lang === 'JP') {
			dist = increaseJP(dist, weightLang);
		}
	}

	return normalized(dist);
};