import { questions } from "@/data/questions";
import type { Answer } from "@/core/types";

/** Key to the MBTI dimension values */
export const MBTI_KEYS = ["E", "I", "S", "N", "T", "F", "J", "P"] as const;

/** doubleWeightIds from scoring.ts */
export const DOUBLE_WEIGHT_IDS = [
	"q1",
	"q5",
	"q8",
	"q10",
	"q11",
	"q14",
	"q20",
	"q21",
	"q29",
	"q33",
	"q36",
	"q39",
];

/** Build an answers map answering every question with the first option */
export function answerFirstOptionAll(): Record<string, Answer> {
	const rec: Record<string, Answer> = {};
	for (const q of questions) {
		rec[q.id] = { value: q.options[0].value, index: 0 };
	}
	return rec;
}
