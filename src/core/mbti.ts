import { questions } from "@/data/questions";
import type { MBTIScores, MBTIResult, Answers, MBTIVector } from "@/core/types";

const emptyScores = (): MBTIScores => ({
	E: 0,
	I: 0,
	S: 0,
	N: 0,
	T: 0,
	F: 0,
	J: 0,
	P: 0,
});

const getPropertyOccurrence = (prop: string) => {
	let result = 0;
	for (const question of questions) {
		for (const option of question.options) {
			if (option.value.includes(prop)) {
				result += 1;
				break;
			}
		}
	}
	return result;
};

// [max, min][]
const vectorRange = [
	[getPropertyOccurrence("E"), -getPropertyOccurrence("I")],
	[getPropertyOccurrence("S"), -getPropertyOccurrence("N")],
	[getPropertyOccurrence("T"), -getPropertyOccurrence("F")],
	[getPropertyOccurrence("J"), -getPropertyOccurrence("P")],
];

export function computeMBTI(answers: Answers): MBTIResult {
	const scores = emptyScores();

	for (const q of questions) {
		const ans = answers[q.id];
		if (ans === undefined) continue;

		const val = q.options[ans].value;
		for (const v of val.split("")) {
			scores[v as keyof MBTIScores] += 1;
		}
	}

	const mbti =
		(scores.E >= scores.I ? "E" : "I") +
		(scores.S >= scores.N ? "S" : "N") +
		(scores.T >= scores.F ? "T" : "F") +
		(scores.J >= scores.P ? "J" : "P");

	const vector: MBTIVector = [
		scores.E - scores.I,
		scores.S - scores.N,
		scores.T - scores.F,
		scores.J - scores.P,
	];

	// Normalize to [-1,1]
	for (let i = 0; i < vector.length; i++) {
		const v = vector[i];
		if (v > 0) {
			const max = vectorRange[i][0];
			const min = 0;
			vector[i] = (v - min) / (max - min);
		} else if (v < 0) {
			const max = 0;
			const min = vectorRange[i][1];
			vector[i] = (v - min) / (max - min) - 1;
		} else {
			vector[i] = 0;
		}
	}

	return { scores, mbti, vector };
}
