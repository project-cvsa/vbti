import type { Question } from "@/core/types";
import { questions } from "@/data/questions";

function analyzeQuestionBalance(questions: Question[]): void {
	const pairs: [string, string][] = [
		["E", "I"],
		["S", "N"],
		["T", "F"],
		["J", "P"],
	];
	const total = questions.length;

	const stats: Record<string, number> = {};
	for (const d of pairs.flat()) {
		stats[d] = 0;
	}

	for (const q of questions) {
		const seen = new Set<string>();
		for (const opt of q.options) {
			const values = opt.value.toUpperCase();
			for (const v of values.split("")) {
				if (v in stats) seen.add(v);
			}
		}
		for (const v of seen) {
			stats[v]++;
		}
	}

	const report = [];
	for (const [a, b] of pairs) {
		const ca = stats[a];
		const cb = stats[b];
		report.push({
			Pair: `${a}/${b}`,
			"Former Count": ca,
			"Latter Count": cb,
			Diff: Math.abs(ca - cb),
			Balance: Math.abs(ca - cb) <= 1 ? "Perfect" : Math.abs(ca - cb) <= 3 ? "OK" : "Skewed",
		});
	}

	console.log(`Total Questions: ${total}`);
	console.table(report);
}

analyzeQuestionBalance(questions);
