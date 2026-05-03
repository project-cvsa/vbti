import { questions } from "@/data/questions";
import type { Answer } from "@/core/types";

/** Key to the MBTI dimension values */
export const MBTI_KEYS = ["E", "I", "S", "N", "T", "F", "J", "P"] as const;

/** doubleWeightIds from scoring.ts */
export const DOUBLE_WEIGHT_IDS = [
	"q1",
	"q2",
	"q8",
	"q18",
	"q14",
	"q13",
	"q23",
	"q27",
	"q31",
	"q35",
	"q38",
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
