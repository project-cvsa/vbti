import { describe, it, expect } from "vitest";
import { findMatchCharacterRaw } from "@/core/findChar";
import { questions } from "@/data/questions";
import { characters } from "@/data/characters";
import type { Answer } from "@/core/types";
import { xoroshiro128plus } from "pure-rand/generator/xoroshiro128plus";
import { uniformFloat64 } from "pure-rand/distribution/uniformFloat64";
import { computeMBTI } from "../mbti";

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

const distinctEntries: Record<string, { value: string; index: number }[]> = {};
for (const q of questions) {
	const seen = new Set<string>();
	const entries: { value: string; index: number }[] = [];
	for (let i = 0; i < q.options.length; i++) {
		const key = optionKey(q.options[i]);
		if (!seen.has(key)) {
			seen.add(key);
			entries.push({ value: q.options[i].value, index: i });
		}
	}
	distinctEntries[q.id] = entries;
}

function randomAnswers(rng: () => number): Record<string, Answer> {
	const rec: Record<string, Answer> = {};
	for (const q of questions) {
		const entries = distinctEntries[q.id];
		const picked = entries[Math.floor(rng() * entries.length)];
		rec[q.id] = { value: picked.value, index: picked.index };
	}
	return rec;
}

const FULL_SETS = 100000;

function generate(count: number, fn: (rng: () => number) => Record<string, Answer>) {
	const out: Record<string, Answer>[] = [];
	for (let i = 0; i < count; i++) out.push(fn(seededRandom));
	return out;
}

const fullSets = generate(FULL_SETS, randomAnswers);

describe("Distribution report", () => {

	function printCharReport(title: string, charCounts: Record<string, number>, totalN: number) {
		console.log(`\n=== ${title} (n=${totalN}) ===\n`);
		const sorted = Object.entries(charCounts).sort(([, a], [, b]) => b - a);
		let rank = 0;
		for (const [name, count] of sorted) {
			rank++;
			const pct = ((count / totalN) * 100).toFixed(3);
			const info = characters[name];
			const label = info ? `${info.mbti}/${info.lang}` : "ENTJ";
			const displayName = name === "undefined" ? "未测出" : name;
			console.log(`${String(rank).padStart(2)}. ${displayName} [${label}] — ${pct}%`);
		}
	}

	it("Character distribution", () => {
		const optionLabels = ["A", "B", "C", "D"];
		const charCounts: Record<string, number> = {};
		const firstPath: Record<string, Record<string, Answer>> = {};
		const mbtiCounts: Record<string, number> = {};
		const charProb: Record<string, number> = {};

		for (const answers of fullSets) {
			const [matched, dist] = findMatchCharacterRaw(answers);
			const mbti = computeMBTI(answers).mbti;
			charCounts[matched] = (charCounts[matched] ?? 0) + 1;
			mbtiCounts[mbti] = (mbtiCounts[mbti] ?? 0) + 1;
			for (const char in dist) {
				charProb[char] = (charProb[char] ?? 0) + dist[char];
			}
			if (!(matched in firstPath)) firstPath[matched] = answers;
		}

		printCharReport("Character Distribution (full answer sets)", charCounts, FULL_SETS);

		const total = Object.values(charCounts).reduce((a, b) => a + b, 0);
		expect(total).toBe(FULL_SETS);

		console.log("\n=== Answer Paths Per Character ===\n");
		const charNames = Object.keys(characters);
		for (const name of charNames) {
			const char = characters[name];
			const path = firstPath[name];
			if (!path) {
				console.log(`${name.padEnd(8)} [${char.mbti}/${char.lang}] — NOT FOUND IN SAMPLE`);
				continue;
			}
			const r = computeMBTI(path);
			const seq = questions.map((q) => optionLabels[path[q.id].index]).join("");
			const chunks: string[] = [];
			for (let i = 0; i < seq.length; i += 10) chunks.push(seq.slice(i, i + 10));
			console.log(
				`${name.padEnd(8)} [${char.mbti}/${char.lang}]  ` +
				`E:${String(r.scores.E).padStart(2)} I:${String(r.scores.I).padStart(2)} ` +
				`S:${String(r.scores.S).padStart(2)} N:${String(r.scores.N).padStart(2)} ` +
				`T:${String(r.scores.T).padStart(2)} F:${String(r.scores.F).padStart(2)} ` +
				`J:${String(r.scores.J).padStart(2)} P:${String(r.scores.P).padStart(2)}`
			);
			console.log(`  path: ${chunks.join(" ")}`);
		}

		console.log("\n=== MBTI Distribution ===\n");

		// 按类型分组统计
		const mbtiGroups: Record<string, string[]> = {};
		for (const [mbti, count] of Object.entries(mbtiCounts).sort(([a], [b]) => a.localeCompare(b))) {
			if (!mbtiGroups[mbti]) mbtiGroups[mbti] = [];
			mbtiGroups[mbti].push(`${mbti}: ${count}`);
		}

		// 输出每个 MBTI 类型的数量和百分比
		for (const [mbti, count] of Object.entries(mbtiCounts).sort(([a], [b]) => a.localeCompare(b))) {
			const pct = ((count / total) * 100).toFixed(1);
			const bar = "█".repeat(Math.round(count / total * 50));
			console.log(`${mbti.padEnd(6)} ${String(count).padStart(4)} (${String(pct).padStart(5)}%) ${bar}`);
		}

		console.log("\n=== Average Character Probability Distribution ===\n");

		for (const name of charNames) {
			const avgProb = charProb[name] ? (charProb[name] / total * 100).toFixed(1) : "0.0";
			console.log(`${name.padEnd(3)} ${String(avgProb).padStart(5)}%`);
		}

		const missing = charNames.filter((n) => !(n in firstPath));
		expect(missing).toEqual([]);
	});
});

describe("Q0 preference simulations", () => {
	// q0 的选项，根据你的实际题目定义调整
	const q0Options = [
		{ index: 0, label: "自推/爱听" },
		{ index: 1, label: "冷门/小众" },
		{ index: 2, label: "随机/无所谓" },
	];

	// 固定指定题目答案的生成器工厂
	function fixedAnswerGenerator(
		qId: string,
		optionIndex: number,
	): (rng: () => number) => Record<string, Answer> {
		return (rng) => {
			const answers = randomAnswers(rng);
			const q = questions.find(q => q.id === qId)!;
			answers[qId] = {
				value: q.options[optionIndex].value,
				index: optionIndex,
			};
			return answers;
		};
	}

	function printCharReport(title: string, charCounts: Record<string, number>, totalN: number) {
		console.log(`\n=== ${title} (n=${totalN}) ===\n`);
		const sorted = Object.entries(charCounts).sort(([, a], [, b]) => b - a);
		let rank = 0;
		for (const [name, count] of sorted) {
			rank++;
			const pct = ((count / totalN) * 100).toFixed(3);
			const info = characters[name];
			const label = info ? `${info.mbti}/${info.lang}` : "UNKNOWN";
			const displayName = name === "undefined" ? "未测出" : name;
			console.log(`${String(rank).padStart(2)}. ${displayName} [${label}] — ${pct}%`);
		}
	}

	// 为每个 q0 选项创建独立测试
	for (const opt of q0Options) {
		it(`q0 = ${opt.label} (index ${opt.index})`, () => {
			const generator = fixedAnswerGenerator(questions[0].id, opt.index);
			const optionSets = generate(FULL_SETS, generator);

			const charCounts: Record<string, number> = {};
			const mbtiCounts: Record<string, number> = {};
			const charProb: Record<string, number> = {};

			for (const answers of optionSets) {
				const [matched, dist] = findMatchCharacterRaw(answers);
				const mbti = computeMBTI(answers).mbti;
				charCounts[matched] = (charCounts[matched] ?? 0) + 1;
				mbtiCounts[mbti] = (mbtiCounts[mbti] ?? 0) + 1;
				for (const char in dist) {
					charProb[char] = (charProb[char] ?? 0) + dist[char];
				}
			}

			const total = Object.values(charCounts).reduce((a, b) => a + b, 0);
			expect(total).toBe(FULL_SETS);

			console.log(`\n========== Q0 = ${opt.label} (n=${FULL_SETS}) ==========`);
			printCharReport("Character Distribution", charCounts, FULL_SETS);

			console.log("\n=== MBTI Distribution ===\n");
			for (const [mbti, count] of Object.entries(mbtiCounts).sort(([a], [b]) => a.localeCompare(b))) {
				const pct = ((count / total) * 100).toFixed(1);
				const bar = "█".repeat(Math.round(count / total * 50));
				console.log(`${mbti.padEnd(6)} ${String(count).padStart(4)} (${String(pct).padStart(5)}%) ${bar}`);
			}

			console.log("\n=== Average Character Probability ===\n");
			const charNames = Object.keys(characters);
			for (const name of charNames) {
				const avgProb = charProb[name] ? (charProb[name] / total * 100).toFixed(1) : "0.0";
				console.log(`${name.padEnd(8)} ${String(avgProb).padStart(5)}%`);
			}
		});
	}
});