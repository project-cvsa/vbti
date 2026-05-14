import { it, expect } from "vitest";
import { findMatchCharacterRaw } from "@/core/findChar";
import { questions } from "@/data/questions";
import { characters } from "@/data/characters";
import { xoroshiro128plus } from "pure-rand/generator/xoroshiro128plus";
import { uniformFloat64 } from "pure-rand/distribution/uniformFloat64";
import { computeMBTI } from "../mbti";
import type { Answers } from "@/core/types";

/** Generic count/probability dictionary used internally in fuzz tests */
type CountMap = Record<string, number>;

const seed = 1099;
const rng = xoroshiro128plus(seed);

const seededRandom: () => number = () => {
	return uniformFloat64(rng);
};

/**
 * Build a scoring-identity key for an option.
 * computeMBTI cares about value (for MBTI scores), lang/isCN/isJP (for cnScore/jpScore),
 * and weight (for q39 per-option weight). Two options are "equivalent" only if ALL of these match.
 */
function optionKey(opt: {
	value: string;
	lang?: string;
	isCN?: boolean;
	isJP?: boolean;
	weight?: number;
}) {
	return `${opt.value}|${opt.lang ?? ""}|${opt.isCN ? "CN" : ""}|${opt.isJP ? "JP" : ""}|${opt.weight ?? ""}`;
}

const distinctEntries: Record<string, number[]> = {};

for (const q of questions) {
	const seen = new Set<string>();
	const entries: number[] = [];
	for (let i = 0; i < q.options.length; i++) {
		const key = optionKey(q.options[i]);
		if (!seen.has(key)) {
			seen.add(key);
			entries.push(i);
		}
	}
	distinctEntries[q.id] = entries;
}

function randomAnswers(rng: () => number): Answers {
	const rec: Answers = {};
	for (const q of questions) {
		const entries = distinctEntries[q.id];
		const picked = entries[Math.floor(rng() * entries.length)];
		rec[q.id] = picked;
	}
	return rec;
}

const FULL_SETS = 100000;

function generate(count: number, fn: (rng: () => number) => Answers) {
	const out: Answers[] = [];
	for (let i = 0; i < count; i++) out.push(fn(seededRandom));
	return out;
}

it("Q0 preference simulations", () => {
	const q0Options = [
		{ index: 0, label: "MBTI一致" },
		{ index: 1, label: "自推/爱听" },
		{ index: 2, label: "冷门/小众" },
		{ index: 3, label: "随便/无所谓" },
	];
	const charNames = Object.keys(characters);
	const testedChars: string[] = [];

	// 固定指定题目答案的生成器工厂
	function fixedAnswerGenerator(
		qId: string,
		optionIndex: number
	): (rng: () => number) => Answers {
		return (rng) => {
			const answers = randomAnswers(rng);
			answers[qId] = optionIndex;
			return answers;
		};
	}

	function printCharReport(title: string, charCounts: CountMap, totalN: number) {
		console.log(`\n=== ${title} (n=${totalN}) ===\n`);
		const sorted = Object.entries(charCounts).sort(([, a], [, b]) => b! - a!);
		let rank = 0;
		for (const [name, count] of sorted) {
			rank++;
			const pct = ((count! / totalN) * 100).toFixed(3);
			const info = characters[name];
			const label = info ? `${info.mbti}/${info.lang}` : "UNKNOWN";
			const displayName = name === "undefined" ? "未测出" : name;
			console.log(`${String(rank).padStart(2)}. ${displayName} [${label}] — ${pct}%`);
		}
	}

	function entropy(dist: CountMap): number {
		let h = 0;
		for (const p of Object.values(dist)) {
			if (p! > 0) h -= p! * Math.log2(p!);
		}
		return h;
	}

	// 为每个 q0 选项创建独立测试
	for (const opt of q0Options) {
		const generator = fixedAnswerGenerator(questions[0].id, opt.index);
		const optionSets = generate(FULL_SETS, generator);

		const charCounts: CountMap = {};
		const mbtiCounts: CountMap = {};
		const charProb: CountMap = {};
		const entropies: number[] = [];

		for (const answers of optionSets) {
			const [matched, dist] = findMatchCharacterRaw(answers);
			const mbti = computeMBTI(answers).mbti;
			charCounts[matched] = (charCounts[matched] ?? 0) + 1;
			mbtiCounts[mbti] = (mbtiCounts[mbti] ?? 0) + 1;
			for (const char in dist) {
				charProb[char] = (charProb[char] ?? 0) + dist[char];
			}
			entropies.push(entropy(dist));
		}

		const total = Object.values(charCounts).reduce((a, b) => a! + b!, 0);
		expect(total).toBe(FULL_SETS);

		const eMean = entropies.reduce((a, b) => a + b, 0) / entropies.length;
		const eVariance = entropies.reduce((s, e) => s + (e - eMean) ** 2, 0) / entropies.length;
		const eStd = Math.sqrt(eVariance);
		const eMin = Math.min(...entropies);
		const eMax = Math.max(...entropies);
		const maxPossibleEntropy = Math.log2(Object.keys(characters).length);

		console.log(`\n========== Q0 = ${opt.label} (n=${FULL_SETS}) ==========`);
		console.log(`\n--- Entropy Stats (bits) ---`);
		console.log(`  mean: ${eMean.toFixed(4)}  std: ${eStd.toFixed(4)}`);
		console.log(`  min : ${eMin.toFixed(4)}  max: ${eMax.toFixed(4)}`);
		console.log(`  max possible (uniform): ${maxPossibleEntropy.toFixed(4)}`);

		printCharReport("Character Distribution", charCounts, FULL_SETS);
		for (const char of Object.keys(charCounts)) {
			if (!testedChars.includes(char)) {
				testedChars.push(char);
			}
		}

		console.log("\n=== MBTI Distribution ===\n");
		for (const [mbti, count] of Object.entries(mbtiCounts).sort(([a], [b]) =>
			a.localeCompare(b)
		)) {
			const pct = ((count! / total!) * 100).toFixed(1);
			const bar = "█".repeat(Math.round((count! / total!) * 50));
			console.log(
				`${mbti.padEnd(6)} ${String(count).padStart(4)} (${String(pct).padStart(5)}%) ${bar}`
			);
		}
	}

	const missing = charNames.filter((n) => !testedChars.includes(n));
	expect(missing).toEqual([]);
}, 30000);
