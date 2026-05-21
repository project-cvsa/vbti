import type { Question } from "@/core/types";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";

interface QuestionZeroModalProps {
	question: Question;
	onSelect: (index: number) => void;
	onBack: () => void;
	open: boolean;
}

export function QuestionZeroModal({ question, onSelect, onBack, open }: QuestionZeroModalProps) {
	const optionLabels = ["A", "B", "C", "D"];

	return (
		<Dialog open={open} onOpenChange={() => {}}>
			<DialogContent
				className="max-w-md"
				showCloseButton={false}
				onPointerDownOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle className="text-lg leading-snug">{question.text}</DialogTitle>
					<DialogDescription>选择一个方向，算法将据此为你匹配灵魂歌姬</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-3">
					{question.options.map((opt, i) => (
						<Button
							key={optionLabels[i]}
							variant="outline"
							className="justify-start text-left h-auto py-4 px-5 gap-3 border-2 hover:border-primary hover:bg-primary/5 transition-colors"
							onClick={() => onSelect(i)}
						>
							<span className="font-extrabold text-primary text-base shrink-0">
								{optionLabels[i]}
							</span>
							<span className="text-sm leading-relaxed whitespace-normal">
								{opt.label}
							</span>
						</Button>
					))}
				</div>

				<Button variant="link" className="text-muted-foreground text-xs" onClick={onBack}>
					返回首页
				</Button>
			</DialogContent>
		</Dialog>
	);
}
