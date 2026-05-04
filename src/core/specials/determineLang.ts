import { questions } from "@/data/questions";
import type { Dist, Answers } from "@/core/types";
import { selectCN, selectJP } from "../adjusters";

export const determineLang = (answers: Answers, _dist: Dist): Dist => {
	let dist = { ..._dist };
	const ans33 = answers[questions[33].id];
	const ans34 = answers[questions[34].id];
	// 33选了D且34没选D（听日V）
	if (ans33 === 3) {
		dist = selectJP(dist);
	}
	// 34选了D且33没选D（听中V）
	else if (ans34 === 3) {
		dist = selectCN(dist);
	}
	return dist;
};
