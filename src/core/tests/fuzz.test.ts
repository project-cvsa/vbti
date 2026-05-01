import { describe, it, expect } from "vitest";
import { computeMBTI, getCandidates, findMatchCharacter } from "@/core/scoring";
import { questions } from "@/data/questions";
import { characters } from "@/data/characters";
import type { Answer } from "@/core/types";
import { MBTI_KEYS } from "./helpers";
import { xoroshiro128plus } from "pure-rand/generator/xoroshiro128plus";
import { uniformFloat64 } from "pure-rand/distribution/uniformFloat64";

const seed = 42;
const rng = xoroshiro128plus(seed);

const seededRandom: () => number = () => {
	return uniformFloat64(rng);
};

const distinctValues: Record<string, string[]> = {};
for (const q of questions) {
	const seen = new Set<string>();
	for (const opt of q.options) seen.add(opt.value);
	distinctValues[q.id] = [...seen];
}

function randomAnswers(rng: () => number): Record<string, Answer> {
	const rec: Record<string, Answer> = {};
	for (const q of questions) {
		const vals = distinctValues[q.id];
		const pickedVal = vals[Math.floor(rng() * vals.length)];
		const idx = q.options.findIndex((o) => o.value === pickedVal);
		rec[q.id] = { value: pickedVal, index: Math.max(idx, 0) };
	}
	return rec;
}

const FULL_SETS = 10000;

function generate(count: number, fn: (rng: () => number) => Record<string, Answer>) {
	const out: Record<string, Answer>[] = [];
	for (let i = 0; i < count; i++) out.push(fn(seededRandom));
	return out;
}

const fullSets = generate(FULL_SETS, randomAnswers);

describe("Fuzz: full answer sets", () => {
	it("all 8 score dimensions are non-negative", () => {
		for (const answers of fullSets) {
			const r = computeMBTI(answers);
			for (const k of MBTI_KEYS) expect(r.scores[k]).toBeGreaterThanOrEqual(0);
		}
	});

	it("cnScore / jpScore are non-negative", () => {
		for (const answers of fullSets) {
			const r = computeMBTI(answers);
			expect(r.cnScore).toBeGreaterThanOrEqual(0);
			expect(r.jpScore).toBeGreaterThanOrEqual(0);
		}
	});

	it("MBTI string is valid for every set", () => {
		for (const answers of fullSets) {
			expect(computeMBTI(answers).mbti).toMatch(/^[EI][SN][TF][JP]$/);
		}
	});

	it("MBTI string matches score comparison rule", () => {
		for (const answers of fullSets) {
			const r = computeMBTI(answers);
			const expected =
				(r.scores.E >= r.scores.I ? "E" : "I") +
				(r.scores.S >= r.scores.N ? "S" : "N") +
				(r.scores.T >= r.scores.F ? "T" : "F") +
				(r.scores.J >= r.scores.P ? "J" : "P");
			expect(r.mbti).toBe(expected);
		}
	});

	it("total weight >= answered question count", () => {
		for (const answers of fullSets) {
			const r = computeMBTI(answers);
			const tw = Object.values(r.scores).reduce((a, b) => a + b, 0);
			expect(tw).toBeGreaterThanOrEqual(Object.keys(answers).length);
		}
	});

	it("cnScore/jpScore do not affect MBTI string", () => {
		for (let i = 0; i < 50; i++) {
			const base = fullSets[i];
			const r1 = computeMBTI(base);
			const modified: Record<string, Answer> = {};
			for (const q of questions) {
				const orig = base[q.id];
				const same = q.options.filter((o) => o.value === orig.value);
				if (same.length > 1 && same.some((o) => o.lang || o.isCN || o.isJP)) {
					const idx = q.options.findIndex(
						(o) => o.value === orig.value && q.options.indexOf(o) !== orig.index
					);
					if (idx >= 0) {
						modified[q.id] = { value: orig.value, index: idx };
						continue;
					}
				}
				modified[q.id] = orig;
			}
			expect(computeMBTI(modified).mbti).toBe(r1.mbti);
		}
	});
});

describe("Distribution report", () => {
	it("Score dimension statistics", () => {
		const stats = Object.fromEntries(
			MBTI_KEYS.map((k) => [k, { min: Number.POSITIVE_INFINITY, max: 0, sum: 0 }])
		) as Record<string, { min: number; max: number; sum: number }>;

		for (const answers of fullSets) {
			const r = computeMBTI(answers);
			for (const k of MBTI_KEYS) {
				const v = r.scores[k];
				if (v < stats[k].min) stats[k].min = v;
				if (v > stats[k].max) stats[k].max = v;
				stats[k].sum += v;
			}
		}

		console.log("\n=== Score Dimension Statistics ===\n");
		console.log("Dim |   Min |   Max |   Avg");
		console.log("----|-------|-------|------");
		for (const k of MBTI_KEYS) {
			const avg = (stats[k].sum / FULL_SETS).toFixed(1).padStart(5);
			console.log(
				` ${k}  | ${String(stats[k].min).padStart(4)} | ${String(stats[k].max).padStart(4)} | ${avg}`
			);
		}

		console.log("\n  Pole preference ratio:");
		for (const [a, b] of [
			["E", "I"],
			["S", "N"],
			["T", "F"],
			["J", "P"],
		] as const) {
			const aSum = stats[a].sum;
			const bSum = stats[b].sum;
			const total = aSum + bSum;
			const aPct = total > 0 ? ((aSum / total) * 100).toFixed(1) : "0.0";
			console.log(`  ${a} vs ${b}: ${a}=${aSum} (${aPct}%)  ${b}=${bSum}`);
		}

		expect(Object.values(stats).every((s) => s.min >= 0)).toBe(true);
	});

	it("cnScore / jpScore distribution", () => {
		let cnTotal = 0,
			jpTotal = 0,
			cnWin = 0,
			jpWin = 0,
			tie = 0;

		for (const answers of fullSets) {
			const r = computeMBTI(answers);
			cnTotal += r.cnScore;
			jpTotal += r.jpScore;
			if (r.cnScore > r.jpScore) cnWin++;
			else if (r.jpScore > r.cnScore) jpWin++;
			else tie++;
		}

		console.log("\n=== cnScore / jpScore Distribution ===\n");
		console.log(`  cnScore total:   ${cnTotal}  (avg ${(cnTotal / FULL_SETS).toFixed(1)})`);
		console.log(`  jpScore total:   ${jpTotal}  (avg ${(jpTotal / FULL_SETS).toFixed(1)})`);
		console.log(`  cnScore > jpScore: ${cnWin}  (${((cnWin / FULL_SETS) * 100).toFixed(1)}%)`);
		console.log(`  jpScore > cnScore: ${jpWin}  (${((jpWin / FULL_SETS) * 100).toFixed(1)}%)`);
		console.log(`  tie:               ${tie}  (${((tie / FULL_SETS) * 100).toFixed(1)}%)`);

		expect(cnTotal).toBeGreaterThanOrEqual(0);
		expect(jpTotal).toBeGreaterThanOrEqual(0);
		expect(cnWin + jpWin + tie).toBe(FULL_SETS);
	});

	function printCharReport(title: string, charCounts: Record<string, number>, totalN: number) {
		console.log(`\n=== ${title} (n=${totalN}) ===\n`);
		const sorted = Object.entries(charCounts).sort(([, a], [, b]) => b - a);
		let rank = 0;
		for (const [name, count] of sorted) {
			rank++;
			const pct = ((count / totalN) * 100).toFixed(1);
			const info = characters[name];
			const label = info ? `${info.mbti}/${info.lang}` : "no data";
			const displayName = name === "undefined" ? "(undefined)" : name;
			console.log(
				`${String(rank).padStart(2)}. ${displayName} [${label}] — ${count} (${pct}%)`
			);
		}
	}

	it("Character distribution", () => {
		const charCounts: Record<string, number> = {};

		for (const answers of fullSets) {
			const r = computeMBTI(answers);
			const preferLang = r.cnScore > r.jpScore ? "CN" : r.jpScore > r.cnScore ? "JP" : null;
			const candidates = getCandidates(r.mbti, preferLang as "CN" | "JP" | null);
			const matched = findMatchCharacter(candidates, r.scores);
			charCounts[matched] = (charCounts[matched] ?? 0) + 1;
		}

		printCharReport("Character Distribution (full answer sets)", charCounts, FULL_SETS);

		const total = Object.values(charCounts).reduce((a, b) => a + b, 0);
		expect(total).toBe(FULL_SETS);
	});
});
