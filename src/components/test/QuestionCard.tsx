import { useCallback } from "react";
import type { Question } from "@/core/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const OPTION_CODES = ["A", "B", "C", "D"];

interface QuestionCardProps {
	question: Question;
	questionIndex: number;
	savedAnswer: number | undefined;
	onAnswer: (index: number) => void;
}

function QuestionCard({ question, questionIndex, savedAnswer, onAnswer }: QuestionCardProps) {
	const selectedIndex = savedAnswer;

	const handleValueChange = useCallback(
		(idxStr: string) => {
			const idx = Number(idxStr);
			const opt = question.options[idx];
			if (opt) onAnswer(idx);
		},
		[question.options, onAnswer]
	);

	return (
		<div className="flex flex-col gap-3">
			<span className="self-start inline-flex items-center px-3 py-[0.4rem] rounded-full bg-primary text-primary-foreground font-semibold text-xs">
				第 {questionIndex} 题
			</span>

			<p className="text-lg leading-relaxed text-foreground font-medium whitespace-pre-wrap">
				{question.text}
			</p>

			<RadioGroup
				key={question.id}
				value={selectedIndex != null ? String(selectedIndex) : undefined}
				onValueChange={handleValueChange}
				className="gap-3 mt-2"
			>
				{question.options.map((opt, i) => {
					const code = OPTION_CODES[i] ?? String(i);
					const isChecked = selectedIndex === i;

					return (
						<label
							key={code}
							className={cn(
								"flex gap-3 p-4 rounded-2xl border cursor-pointer transition-colors items-center",
								isChecked
									? "border-primary bg-checked"
									: "border-border bg-background hover:border-primary hover:bg-checked"
							)}
						>
							<RadioGroupItem value={String(i)} />
							<span className="flex items-center gap-2 min-w-0">
								<span className="font-extrabold text-primary shrink-0">{code}</span>
								<span className="text-sm leading-relaxed">{opt.label}</span>
							</span>
						</label>
					);
				})}
			</RadioGroup>
		</div>
	);
}

export default QuestionCard;
