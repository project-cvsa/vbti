import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAtomValue } from "jotai";
import { answersAtom } from "@/state/atoms";

interface AnswersModalProps {
	open: boolean;
	onClose: () => void;
}

export function AnswersModal({ open, onClose }: AnswersModalProps) {
	const answers = useAtomValue(answersAtom);
	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (!o) onClose();
			}}
		>
			<DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
				<pre>
					<code className="text-wrap">
						{JSON.stringify(answers)}
					</code>
				</pre>
			</DialogContent>
		</Dialog>
	);
}
