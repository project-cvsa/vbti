import { useState } from "react";
import type { Question } from "@/core/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SecretQuestionModalProps {
	question: Question;
	onSelect: (targetCharacter: string) => void;
	open: boolean;
	onClose: () => void;
}

export function SecretQuestionModal({ question, onSelect, open }: SecretQuestionModalProps) {
	const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

	return (
		<Dialog open={open} onOpenChange={() => {}}>
			<DialogContent
				className="max-w-md"
				showCloseButton={false}
				onPointerDownOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle className="inline-flex items-center gap-2 text-primary">
						你已触发隐藏题！
					</DialogTitle>
				</DialogHeader>

				<p className="text-lg leading-relaxed">{question.text}</p>

				<RadioGroup
					value={selectedTarget ?? ""}
					onValueChange={setSelectedTarget}
					className="gap-2.5"
				>
					{question.options.map((opt, i) => {
						const code = String.fromCharCode(65 + i);
						const isChecked = selectedTarget === opt.target;

						return (
							<label
								key={opt.target ?? `secret-${i}`}
								className={cn(
									"flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-colors",
									isChecked
										? "border-primary bg-primary/5"
										: "border-border bg-background hover:border-primary/50 hover:bg-primary/5"
								)}
							>
								<RadioGroupItem value={opt.target ?? ""} className="mt-0.5" />
								<span className="flex items-start gap-2">
									<span className="font-extrabold text-primary shrink-0">
										{code}
									</span>
									<span>{opt.label}</span>
								</span>
							</label>
						);
					})}
				</RadioGroup>

				<Button
					className="w-full font-bold"
					disabled={!selectedTarget}
					onClick={() => {
						if (selectedTarget) onSelect(selectedTarget);
					}}
				>
					确定
				</Button>
			</DialogContent>
		</Dialog>
	);
}
