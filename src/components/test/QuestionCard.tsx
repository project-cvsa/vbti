import { useCallback } from "react";
import type { Question, Answer } from "@/core/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const OPTION_CODES = ["A", "B", "C", "D"];

interface QuestionCardProps {
	question: Question;
	questionIndex: number;
	savedAnswer: Answer | undefined;
	onAnswer: (value: string, index: number) => void;
}

function QuestionCard({ question, questionIndex, savedAnswer, onAnswer }: QuestionCardProps) {
	const selectedIndex = savedAnswer?.index;

	const handleValueChange = useCallback(
		(idxStr: string) => {
			const idx = Number(idxStr);
			const opt = question.options[idx];
			if (opt) onAnswer(opt.value, idx);
		},
		[question.options, onAnswer]
	);

	return (
		<div className="rounded-2xl border p-5">
			<div className="flex flex-col gap-3">
				<span className="self-start inline-flex items-center px-3 py-1.5 rounded-full border bg-primary/10 text-primary font-semibold text-xs">
					第 {questionIndex + 1} 题
				</span>

				<p className="text-lg leading-relaxed text-foreground font-medium whitespace-pre-wrap">
					{question.text}
				</p>

				<RadioGroup
					key={question.id}
					value={selectedIndex != null ? String(selectedIndex) : undefined}
					onValueChange={handleValueChange}
					className="gap-2.5 mt-2"
				>
					{question.options.map((opt, i) => {
						const code = OPTION_CODES[i] ?? String(i);
						const isChecked = selectedIndex === i;

						return (
							<label
								key={code}
								className={cn(
									"flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-colors",
									isChecked
										? "border-primary bg-primary/5"
										: "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
								)}
							>
								<RadioGroupItem value={String(i)} className="mt-0.5" />
								<span className="flex items-start gap-2 min-w-0">
									<span className="font-extrabold text-primary shrink-0">
										{code}
									</span>
									<span className="text-sm leading-relaxed">{opt.label}</span>
								</span>
							</label>
						);
					})}
				</RadioGroup>
			</div>
		</div>
	);
}

export default QuestionCard;
