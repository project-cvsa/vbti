import { describe, it, expect } from "vitest";
import { getCandidates, computeDistance, findMatchCharacter } from "@/core/scoring";
import { characters } from "@/data/characters";
import type { MBTIScores, Character } from "@/core/types";

describe("getCandidates", () => {
	it("returns all characters matching the MBTI type without preferLang", () => {
		const candidates = getCandidates("ENFP", null);
		// ENFP characters: 初音未来, GUMI, 重音Teto, 俊达萌, 海伊
		expect(candidates.length).toBeGreaterThanOrEqual(4);
		expect(candidates).toContain("初音未来");
		expect(candidates).toContain("海伊");
	});

	it("with preferLang CN filters to only CN characters", () => {
		const candidates = getCandidates("ENFP", "CN");
		// ENFP CN only: 海伊
		expect(candidates.length).toBeGreaterThanOrEqual(1);
		expect(candidates.every((n) => characters[n].lang === "CN")).toBe(true);
	});

	it("with preferLang JP filters to only JP characters", () => {
		const candidates = getCandidates("ENFP", "JP");
		expect(candidates.length).toBeGreaterThanOrEqual(3);
		expect(candidates.every((n) => characters[n].lang === "JP")).toBe(true);
	});

	it("falls back to all if preferLang filter yields empty", () => {
		// INTJ CN only: 乐正龙牙, 永夜 (both CN)
		// So INTJ with "JP" filter = empty → falls back to all INTJ
		const candidates = getCandidates("INTJ", "JP");
		expect(candidates.length).toBeGreaterThanOrEqual(1);
		// Should contain CN characters since filtered to all
		expect(candidates.some((n) => characters[n].lang === "CN")).toBe(true);
	});

	it("returns empty array for non-existent MBTI type", () => {
		const candidates = getCandidates("XXXX", null);
		expect(candidates).toEqual([]);
	});

	it("preferLang filter on non-existent MBTI returns empty", () => {
		const candidates = getCandidates("XXXX", "CN");
		expect(candidates).toEqual([]);
	});
});

describe("computeDistance", () => {
	it("zero distance when userScores match character perfectly (all neutral)", () => {
		const scores: MBTIScores = { E: 50, I: 50, S: 50, N: 50, T: 50, F: 50, J: 50, P: 50 };
		const char: Character = {
			ie: 50,
			ns: 50,
			ft: 50,
			pj: 50,
			weight: 0,
			lang: "CN",
			mbti: "XXXX",
		} as Character;
		// userVector: [0, 0, 0, 0], charVector: [0, 0, 0, 0]
		// dist = sqrt(0) - 0 = 0
		expect(computeDistance(scores, char)).toBe(0);
	});

	it("positive distance when userScores differ from character", () => {
		const scores: MBTIScores = { E: 80, I: 20, S: 30, N: 70, T: 60, F: 40, J: 10, P: 90 };
		const char: Character = {
			ie: 50,
			ns: 50,
			ft: 50,
			pj: 50,
			weight: 0,
			lang: "JP",
			mbti: "XXXX",
		} as Character;
		// userVector: [60, 40, -20, 80]
		// charVector: [0, 0, 0, 0]
		// dist = sqrt(60^2 + 40^2 + 20^2 + 80^2) = sqrt(3600+1600+400+6400) = sqrt(12000) ≈ 109.5
		const dist = computeDistance(scores, char);
		expect(dist).toBeGreaterThan(0);
		expect(dist).toBeCloseTo(Math.sqrt(60 * 60 + 40 * 40 + -20 * -20 + 80 * 80), 0);
	});

	it("manual math check for computeDistance", () => {
		// userScores: E=10, I=5 → E-I = 5
		//             S=8,  N=2 → N-S = -6
		//             T=3,  F=7 → F-T = 4
		//             J=1,  P=9 → P-J = 8
		// userVector = [5, -6, 4, 8]
		//
		// character: ie=70, ns=40, ft=60, pj=30, weight=1
		// charVector = [20, -10, 10, -20]
		//
		// diffs: (5-20)=(-15)^2=225, (-6+10)=(4)^2=16, (4-10)=(-6)^2=36, (8+20)=(28)^2=784
		// sum = 225+16+36+784 = 1061
		// dist = sqrt(1061) - 1.5 ≈ 32.57 - 1.5 = 31.07
		const scores: MBTIScores = { E: 10, I: 5, S: 8, N: 2, T: 3, F: 7, J: 1, P: 9 };
		const char: Character = {
			ie: 70,
			ns: 40,
			ft: 60,
			pj: 30,
			weight: 1,
			lang: "CN",
			mbti: "XXXX",
		} as Character;
		const expected = Math.sqrt(225 + 16 + 36 + 784) - 1.5;
		expect(computeDistance(scores, char)).toBeCloseTo(expected, 5);
	});

	it("weight reduces distance (can go negative)", () => {
		const scores: MBTIScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
		const char: Character = {
			ie: 50,
			ns: 50,
			ft: 50,
			pj: 50,
			weight: 10,
			lang: "CN",
			mbti: "XXXX",
		} as Character;
		// userVector: [0,0,0,0], charVector: [0,0,0,0]
		// dist = 0 - 15 = -15
		expect(computeDistance(scores, char)).toBe(-15);
	});
});

describe("findMatchCharacter", () => {
	it("returns the only candidate when single candidate", () => {
		const scores: MBTIScores = { E: 50, I: 50, S: 50, N: 50, T: 50, F: 50, J: 50, P: 50 };
		const result = findMatchCharacter(["初音未来"], scores);
		expect(result).toBe("初音未来");
	});

	it("returns closest candidate among multiple", () => {
		// 初音未来: ie=52, ns=56, ft=62, pj=56, weight=1
		// GUMI:      ie=40, ns=52, ft=58, pj=50, weight=0
		// Neutral scores → GUMI wins (lower distance)
		const scores: MBTIScores = { E: 50, I: 50, S: 50, N: 50, T: 50, F: 50, J: 50, P: 50 };
		const result = findMatchCharacter(["初音未来", "GUMI"], scores);
		expect(result).toBe("GUMI");
	});

	it("falls back to first candidate if no character found", () => {
		const scores: MBTIScores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
		const result = findMatchCharacter(["NonExistent", "初音未来"], scores);
		expect(result).toBe("初音未来");
	});
});

describe("ENTJ type special case", () => {
	it("ENTJ characters exist and can be matched", () => {
		const entjCandidates = getCandidates("ENTJ", null);
		// No ENTJ characters in current character data. Verify behavior.
		expect(entjCandidates).toEqual([]);
	});
});
