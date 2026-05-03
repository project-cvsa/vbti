import { describe, it, expect } from "vitest";
import { computeMBTI } from "@/core/scoring";
import { questions } from "@/data/questions";
import type { Answer } from "@/core/types";
import { MBTI_KEYS, DOUBLE_WEIGHT_IDS, answerFirstOptionAll } from "./helpers";

describe("Edge cases", () => {
	it("all same value — all E, all S, all T, all J", () => {
		// Pick the first option with E, S, T, J from relevant questions
		const extremeAnswers: Record<string, Answer> = {};

		// E/I questions: pick E
		const eiQuestions = questions.filter((q) => q.options.some((o) => o.value === "E"));
		for (const q of eiQuestions) {
			const eIdx = q.options.findIndex((o) => o.value === "E");
			extremeAnswers[q.id] = { value: "E", index: Math.max(eIdx, 0) };
		}

		// S/N questions: pick S
		const snQuestions = questions.filter(
			(q) => q.options.some((o) => o.value === "S") && !eiQuestions.includes(q)
		);
		for (const q of snQuestions) {
			const sIdx = q.options.findIndex((o) => o.value === "S");
			extremeAnswers[q.id] = { value: "S", index: Math.max(sIdx, 0) };
		}

		// T/F questions: pick T
		const tfQuestions = questions.filter(
			(q) =>
				q.options.some((o) => o.value === "T") &&
				!eiQuestions.includes(q) &&
				!snQuestions.includes(q)
		);
		for (const q of tfQuestions) {
			const tIdx = q.options.findIndex((o) => o.value === "T");
			extremeAnswers[q.id] = { value: "T", index: Math.max(tIdx, 0) };
		}

		// J/P questions: pick J
		const jpQuestions = questions.filter(
			(q) =>
				q.options.some((o) => o.value === "J") &&
				!eiQuestions.includes(q) &&
				!snQuestions.includes(q) &&
				!tfQuestions.includes(q)
		);
		for (const q of jpQuestions) {
			const jIdx = q.options.findIndex((o) => o.value === "J");
			extremeAnswers[q.id] = { value: "J", index: Math.max(jIdx, 0) };
		}

		const result = computeMBTI(extremeAnswers);
		expect(result.mbti).toBe("ESTJ");
	});

	it("every possible MBTI type is achievable from the question set", () => {
		// For each of the 16 MBTI types, verify it's possible to get that type
		// by constructing answers with all options for the preferred pole
		const allTypes = [
			"ESTJ",
			"ESTP",
			"ESFJ",
			"ESFP",
			"ENTJ",
			"ENTP",
			"ENFJ",
			"ENFP",
			"ISTJ",
			"ISTP",
			"ISFJ",
			"ISFP",
			"INTJ",
			"INTP",
			"INFJ",
			"INFP",
		];

		// Build a lookup: dimension → array of questions that have options with that value
		const dimQuestions: Record<string, typeof questions> = {};
		for (const dim of MBTI_KEYS) {
			dimQuestions[dim] = questions.filter((q) => q.options.some((o) => o.value === dim));
		}

		for (const mbtiType of allTypes) {
			const [eOrI, sOrN, tOrF, jOrP] = mbtiType.split("");
			const preferred = [eOrI, sOrN, tOrF, jOrP];

			// Answer all questions that have preferred dimension options, picking the preferred value
			const answers: Record<string, Answer> = {};
			for (const dim of preferred) {
				for (const q of dimQuestions[dim]) {
					if (answers[q.id]) continue; // already answered (cross-dimension questions)
					const idx = q.options.findIndex((o) => o.value === dim);
					answers[q.id] = { value: dim, index: Math.max(idx, 0) };
				}
			}

			const result = computeMBTI(answers);
			// The result should match the desired type (all preferred poles should win)
			expect([result.mbti]).toContainEqual(mbtiType);
		}
	});

	it("no answers at all returns ESTJ with all zeros", () => {
		const result = computeMBTI({});
		expect(result.scores.E).toBe(0);
		expect(result.scores.I).toBe(0);
		expect(result.scores.S).toBe(0);
		expect(result.scores.N).toBe(0);
		expect(result.scores.T).toBe(0);
		expect(result.scores.F).toBe(0);
		expect(result.scores.J).toBe(0);
		expect(result.scores.P).toBe(0);
		expect(result.mbti).toBe("ESTJ");
		expect(result.cnScore).toBe(0);
		expect(result.jpScore).toBe(0);
	});

	it("weight accumulation for double weight questions is correct", () => {
		// Answer all double-weight questions with J → should get sum of weights
		const answers: Record<string, Answer> = {};
		for (const id of DOUBLE_WEIGHT_IDS) {
			if (id === "q39") continue; // q39 has per-option weight
			const q = questions.find((x) => x.id === id);
			if (!q) return [];
			const jIdx = q.options.findIndex((o) => o.value === "J");
			if (jIdx >= 0) {
				answers[id] = { value: "J", index: jIdx };
			}
		}
		const result = computeMBTI(answers);
		// Count how many DW questions have J as an option and were answered
		const dwWithJ = DOUBLE_WEIGHT_IDS.filter((id) => {
			if (id === "q39") return false;
			const q = questions.find((x) => x.id === id);
			if (!q) return [];
			return q.options.some((o) => o.value === "J");
		}).length;
		expect(result.scores.J).toBe(dwWithJ * 2);
	});

	it("q39 weight=1 option — find(value='P') returns first P (weight=2)", () => {
		// q39 opt2 (index=2): value=P, weight=1 — but find(value="P") returns opt1 (weight=2)
		const result = computeMBTI({ q39: { value: "P", index: 2 } });
		expect(result.scores.P).toBe(2);
	});

	it("questions with mixed dimension options count correctly", () => {
		// q22 has options: J, P, P, E → the E option should count toward E
		const result = computeMBTI({ q24: { value: "E", index: 3 } });
		expect(result.scores.E).toBe(1);
		expect(result.scores.J).toBe(0);
		expect(result.scores.P).toBe(0);
	});

	it("q27 has T option that counts toward T", () => {
		const result = computeMBTI({ q27: { value: "T", index: 2 } });
		expect(result.scores.T).toBe(2); // double weight
		expect(result.scores.J).toBe(0);
		expect(result.scores.P).toBe(0);
		expect(result.scores.E).toBe(0);
	});

	it("q28 has I option that counts toward I", () => {
		const result = computeMBTI({ q28: { value: "I", index: 2 } });
		expect(result.scores.I).toBe(1);
		expect(result.scores.J).toBe(0);
		expect(result.scores.P).toBe(0);
	});
});

describe("Consistency checks", () => {
	it("computeMBTI with fixed answer set produces deterministic result", () => {
		const allAnswers = answerFirstOptionAll();
		const r1 = computeMBTI(allAnswers);
		const r2 = computeMBTI(allAnswers);
		expect(r2).toEqual(r1);
		for (let i = 0; i < 10; i++) {
			expect(computeMBTI(allAnswers)).toEqual(r1);
		}
	});

	it("computeMBTI result object has exactly 4 keys", () => {
		const result = computeMBTI({ q1: { value: "J", index: 0 } });
		const keys = Object.keys(result);
		expect(keys).toHaveLength(4);
		expect(keys).toContain("scores");
		expect(keys).toContain("mbti");
		expect(keys).toContain("cnScore");
		expect(keys).toContain("jpScore");
	});

	it("scores object has exactly 8 keys", () => {
		const result = computeMBTI({});
		const keys = Object.keys(result.scores);
		expect(keys).toHaveLength(8);
		for (const k of MBTI_KEYS) {
			expect(keys).toContain(k);
		}
	});

	it("all 39 questions are referenced in the data", () => {
		const ids = questions.map((q) => q.id);
		expect(ids).toHaveLength(39);
		const unique = new Set(ids);
		expect(unique.size).toBe(39);
	});

	it("all double weight IDs are valid question IDs", () => {
		const allIds = new Set(questions.map((q) => q.id));
		for (const id of DOUBLE_WEIGHT_IDS) {
			expect(allIds.has(id)).toBe(true);
		}
	});
});
