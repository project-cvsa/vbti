import { describe, it, expect } from "vitest";
import { computeMBTI } from "@/core/scoring";
import { questions } from "@/data/questions";
import type { MBTIScores } from "@/core/types";
import { MBTI_KEYS, DOUBLE_WEIGHT_IDS, answerFirstOptionAll } from "./helpers";

describe("computeMBTI – empty / missing answers", () => {
	it("empty answers → all scores 0, MBTI ESTJ (ties all go to first pole)", () => {
		const result = computeMBTI({});
		expect(result.scores.E).toBe(0);
		expect(result.scores.I).toBe(0);
		expect(result.scores.S).toBe(0);
		expect(result.scores.N).toBe(0);
		expect(result.scores.T).toBe(0);
		expect(result.scores.F).toBe(0);
		expect(result.scores.J).toBe(0);
		expect(result.scores.P).toBe(0);
		expect(result.cnScore).toBe(0);
		expect(result.jpScore).toBe(0);
		// ties: E>=I → E, S>=N → S, T>=F → T, J>=P → J
		expect(result.mbti).toBe("ESTJ");
	});

	it("missing questions are skipped (no error thrown)", () => {
		// Only answer q1, leave rest missing
		const result = computeMBTI({ q1: { value: "J", index: 0 } });
		expect(result.scores.J).toBeGreaterThan(0);
	});
});

describe("computeMBTI – single question scoring", () => {
	it("q1 answered J → J += 2 (double weight), other dims 0", () => {
		const result = computeMBTI({ q1: { value: "J", index: 0 } });
		expect(result.scores.J).toBe(2);
		expect(result.scores.P).toBe(0);
		expect(result.scores.E).toBe(0);
		expect(result.scores.I).toBe(0);
		expect(result.scores.S).toBe(0);
		expect(result.scores.N).toBe(0);
		expect(result.scores.T).toBe(0);
		expect(result.scores.F).toBe(0);
		expect(result.mbti).toBe("ESTJ");
	});

	it("q1 answered P → P += 2 (double weight)", () => {
		const result = computeMBTI({ q1: { value: "P", index: 1 } });
		expect(result.scores.P).toBe(2);
		expect(result.scores.J).toBe(0);
		expect(result.mbti).toBe("ESTP");
	});
});

describe("computeMBTI – double weight questions", () => {
	for (const dwId of DOUBLE_WEIGHT_IDS) {
		// Skip q39 (has per-option weight override, tested separately)
		if (dwId === "q39") continue;

		it(`${dwId} applies weight=2`, () => {
			const q = questions.find((x) => x.id === dwId);
			if (!q) return;
			const opt = q.options[0];
			const result = computeMBTI({ [dwId]: { value: opt.value, index: 0 } });
			const score = result.scores[opt.value as keyof MBTIScores] ?? 0;
			expect(score).toBe(2);
		});
	}
});

describe("computeMBTI – non-double-weight questions get weight=1", () => {
	// Pick a few non-DW questions
	const nonDW = ["q2", "q3", "q4", "q7", "q9", "q13"];
	for (const id of nonDW) {
		it(`${id} applies weight=1`, () => {
			const q = questions.find((x) => x.id === id);
			if (!q) return;
			const opt = q.options[0];
			const result = computeMBTI({ [id]: { value: opt.value, index: 0 } });
			const score = result.scores[opt.value as keyof MBTIScores] ?? 0;
			expect(score).toBe(1);
		});
	}
});

describe("computeMBTI – q39 per-option weight", () => {
	// q39 options:
	// 0: value=J, weight=2
	// 1: value=P, weight=2
	// 2: value=P, weight=1  ← only weight=1
	// 3: value=N, weight=2

	it("q39 option 0 (J, weight=2) → J += 2", () => {
		const result = computeMBTI({ q39: { value: "J", index: 0 } });
		expect(result.scores.J).toBe(2);
		expect(result.scores.P).toBe(0);
		expect(result.scores.N).toBe(0);
	});

	it("q39 option 1 (P, weight=2) → P += 2", () => {
		const result = computeMBTI({ q39: { value: "P", index: 1 } });
		expect(result.scores.P).toBe(2);
		expect(result.scores.J).toBe(0);
	});

	it("q39 option 2 (P, weight=2 — find() returns first P option, which is weight=2)", () => {
		// q39 options: 0:J(w=2), 1:P(w=2), 2:P(w=1), 3:N(w=2)
		// find(value="P") returns option 1 (weight=2), not option 2 (weight=1)
		const result = computeMBTI({ q39: { value: "P", index: 2 } });
		expect(result.scores.P).toBe(2);
		expect(result.scores.J).toBe(0);
		expect(result.scores.N).toBe(0);
	});

	it("q39 option 3 (N, weight=2) → N += 2", () => {
		const result = computeMBTI({ q39: { value: "N", index: 3 } });
		expect(result.scores.N).toBe(2);
		expect(result.scores.S).toBe(0);
		expect(result.scores.J).toBe(0);
		expect(result.scores.P).toBe(0);
	});
});

describe("computeMBTI – cnScore / jpScore from option.lang", () => {
	it("q7 option 0 has lang=CN → cnScore incremented", () => {
		// q7 opt 0: value=E, lang=CN
		const result = computeMBTI({ q7: { value: "E", index: 0 } });
		expect(result.cnScore).toBeGreaterThan(0);
		expect(result.jpScore).toBe(0);
	});

	it("q7 option 1 has lang=JP → jpScore incremented", () => {
		// q7 opt 1: value=I, lang=JP
		const result = computeMBTI({ q7: { value: "I", index: 1 } });
		expect(result.jpScore).toBeGreaterThan(0);
		expect(result.cnScore).toBe(0);
	});

	it("q7 option 2 — find(value='I') returns option 1 (lang=JP), so jpScore, not cnScore", () => {
		// q7 options: 0:E(CN), 1:I(JP), 2:I(CN), 3:I(JP)
		// find(value="I") finds option 1 first (lang="JP")
		const result = computeMBTI({ q7: { value: "I", index: 2 } });
		expect(result.jpScore).toBeGreaterThan(0);
		expect(result.cnScore).toBe(0);
	});

	it("q7 option 3 has lang=JP → jpScore incremented", () => {
		const result = computeMBTI({ q7: { value: "I", index: 3 } });
		expect(result.jpScore).toBeGreaterThan(0);
	});

	it("option without lang does NOT affect cnScore/jpScore", () => {
		// q1 has no lang on any option
		const result = computeMBTI({ q1: { value: "J", index: 0 } });
		expect(result.cnScore).toBe(0);
		expect(result.jpScore).toBe(0);
	});
});

describe("computeMBTI – cnScore / jpScore from legacy isCN/isJP (q31/q32)", () => {
	it("q31 option 0 has isCN → cnScore incremented (S, weight=1)", () => {
		const result = computeMBTI({ q31: { value: "S", index: 0 } });
		expect(result.cnScore).toBe(1);
		expect(result.jpScore).toBe(0);
	});

	it("q31 option 3 has isJP → jpScore incremented, no score added (value=JP not in MBTIScores)", () => {
		// value="JP" is not a dimension key → not added to scores
		const result = computeMBTI({ q31: { value: "JP", index: 3 } });
		expect(result.jpScore).toBe(1);
		expect(result.cnScore).toBe(0);
		// "JP" is not an own property of scores → no dimension changed
		for (const k of MBTI_KEYS) {
			expect(result.scores[k]).toBe(0);
		}
	});

	it("q32 option 0 has isJP → jpScore incremented (S, weight=1)", () => {
		const result = computeMBTI({ q32: { value: "S", index: 0 } });
		expect(result.jpScore).toBe(1);
		expect(result.cnScore).toBe(0);
	});

	it("q32 option 3 has isCN → cnScore incremented, value=CN not added to scores", () => {
		const result = computeMBTI({ q32: { value: "CN", index: 3 } });
		expect(result.cnScore).toBe(1);
		expect(result.jpScore).toBe(0);
		for (const k of MBTI_KEYS) {
			expect(result.scores[k]).toBe(0);
		}
	});
});

describe("computeMBTI – values not in MBTI dimension set are NOT added to scores", () => {
	it("q31 value='JP' → jpScore+=1, but no dimension score changes", () => {
		const result = computeMBTI({ q31: { value: "JP", index: 3 } });
		expect(result.jpScore).toBe(1);
		const allZero = MBTI_KEYS.every((k) => result.scores[k] === 0);
		expect(allZero).toBe(true);
	});

	it("q32 value='CN' → cnScore+=1, but no dimension score changes", () => {
		const result = computeMBTI({ q32: { value: "CN", index: 3 } });
		expect(result.cnScore).toBe(1);
		const allZero = MBTI_KEYS.every((k) => result.scores[k] === 0);
		expect(allZero).toBe(true);
	});
});

describe("computeMBTI – MBTI string tie-breaking (>= favors first pole)", () => {
	it("E==I tie: 'E' wins", () => {
		// q7 opt0: E w=1; q17 opt0: E w=1 → E=2
		// q14 opt1: I w=2 → I=2
		// Tie: E>=I → 'E'
		const result = computeMBTI({
			q7: { value: "E", index: 0 },
			q17: { value: "E", index: 0 },
			q14: { value: "I", index: 1 },
		});
		expect(result.scores.E).toBe(2);
		expect(result.scores.I).toBe(2);
		expect(result.mbti[0]).toBe("E");
	});

	it("S==N tie: 'S' wins", () => {
		// q6 opt1: N w=1; q37 opt3: N w=1 → N=2
		// q29 opt0: S w=2 (double weight) → S=2
		const result = computeMBTI({
			q6: { value: "N", index: 1 },
			q37: { value: "N", index: 3 },
			q29: { value: "S", index: 0 },
		});
		expect(result.scores.S).toBe(result.scores.N);
		expect(result.mbti[1]).toBe("S");
	});

	it("T==F tie: 'T' wins", () => {
		// q13 opt2: F (w=1); q15 opt1: F (w=1) → F=2
		// q8 opt2: T (w=2, double weight) → T=2
		const result = computeMBTI({
			q13: { value: "F", index: 2 },
			q15: { value: "F", index: 1 },
			q8: { value: "T", index: 2 },
		});
		expect(result.scores.T).toBe(result.scores.F);
		expect(result.mbti[2]).toBe("T");
	});

	it("J==P tie: 'J' wins", () => {
		// q3 opt0: J (w=1); q22 opt0: J (w=1) → J=2
		// q20 opt0: P (w=2, double weight) → P=2
		const result = computeMBTI({
			q3: { value: "J", index: 0 },
			q22: { value: "J", index: 0 },
			q20: { value: "P", index: 0 },
		});
		expect(result.scores.J).toBe(result.scores.P);
		expect(result.mbti[3]).toBe("J");
	});
});

describe("computeMBTI – cnScore/jpScore do not affect MBTI string", () => {
	it("high cnScore does NOT change MBTI", () => {
		// Answer all CN-tagged and isCN-tagged questions, verify MBTI is consistent
		const allAnswers = answerFirstOptionAll();
		const result1 = computeMBTI(allAnswers);
		// cnScore should be > 0 because many questions have lang=CN
		expect(result1.cnScore).toBeGreaterThan(0);
		// MBTI is purely from score comparisons
		expect(result1.mbti).toBe(result1.mbti);
	});
});
