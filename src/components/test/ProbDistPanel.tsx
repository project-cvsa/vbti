import { useState, useMemo } from "react";
import { useAtomValue } from "jotai";
import { answersAtom, probDistAtom } from "@/state/atoms";
import { characters } from "@/data/characters";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { computeMBTI } from "@/core/mbti";
import { findMatchCharacter } from "@/core/findChar";

export default function ProbDistPanel() {
	const answers = useAtomValue(answersAtom);
	const mbti = computeMBTI(answers);
	const dist = useAtomValue(probDistAtom);
	const char = findMatchCharacter(answers);
	const [expanded, setExpanded] = useState(true);

	const sorted = useMemo(() => {
		if (!dist) return [];
		return Object.entries(dist)
			.filter(([, p]) => p > 0.001)
			.sort(([, a], [, b]) => b - a);
	}, [dist]);

	if (!dist) {
		return (
			<div className="rounded-2xl border border-border bg-card p-5">
				<div className="flex items-center gap-2 text-muted-foreground">
					<BarChart3 className="h-4 w-4" />
					<span className="text-sm font-medium">概率分布</span>
				</div>
				<p className="mt-3 text-xs text-muted-foreground/70">
					开始答题后，这里将实时显示各角色匹配概率
				</p>
			</div>
		);
	}

	const maxProb = sorted[0]?.[1] ?? 0;

	return (
		<div className="rounded-2xl border border-border bg-card overflow-hidden">
			<button
				type="button"
				className="flex items-center justify-between w-full p-5 hover:bg-accent-50 transition-colors cursor-pointer"
				onClick={() => setExpanded((v) => !v)}
			>
				<div className="flex items-center gap-2 text-muted-foreground">
					<BarChart3 className="h-4 w-4" />
					<span className="text-sm font-medium">概率分布</span>
				</div>
				{expanded ? (
					<ChevronUp className="h-4 w-4 text-muted-foreground" />
				) : (
					<ChevronDown className="h-4 w-4 text-muted-foreground" />
				)}
			</button>

			{expanded && (
				<div className="px-5 pb-4 space-y-2">
					<p className="text-sm font-medium text-muted-foreground mt-4">
						当前MBTI推测: {mbti.mbti}, 向量: [
						{mbti.vector.map((v) => v.toFixed(3)).join(", ")}]
						<br />
						测试结果: {char}
					</p>
					{sorted.map(([charName, prob]) => {
						const char = characters[charName];
						const pct = (prob * 100).toFixed(1);
						const widthPct = maxProb > 0 ? (prob / maxProb) * 100 : 0;

						return (
							<div key={charName} className="group">
								<div className="flex items-center justify-between mb-1">
									<span className="text-xs font-medium truncate">{charName}</span>
									<span className="text-xs text-muted-foreground tabular-nums ml-2 shrink-0">
										{pct}%
									</span>
								</div>
								<div className="h-2 rounded-full bg-muted-80 overflow-hidden">
									<div
										className={cn(
											"h-full rounded-full transition-all duration-500 ease-out",
											widthPct > 0 && "min-w-1"
										)}
										style={{
											width: `${widthPct}%`,
											backgroundColor: char?.color ?? "#888",
										}}
									/>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
