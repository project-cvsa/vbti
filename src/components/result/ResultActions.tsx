import { Button } from "@/components/ui/button";
import { ShareBtn } from "@/components/ShareBtn";
import { report } from "@/lib/telemetry";

interface ResultActionsProps {
	resultCharacter: string;
	mbti: string;
	isDev: boolean;
	onGoHome: () => void;
	onRestart: () => void;
	onOpenCard: () => void;
	onOpenAnswers: () => void;
}

export function ResultActions({
	resultCharacter,
	mbti,
	isDev,
	onGoHome,
	onRestart,
	onOpenCard,
	onOpenAnswers,
}: ResultActionsProps) {
	return (
		<div className="flex justify-between gap-3 flex-wrap mt-5 items-center">
			<div className="flex gap-2">
				<Button onClick={onGoHome} className="result-accent-btn">
					回到首页
				</Button>
				<Button variant="outline" onClick={onRestart}>
					重新测试
				</Button>
			</div>
			<div className="flex gap-2">
				{isDev && (
					<Button
						variant="outline"
						onClick={() => {
							report("view_answers");
							onOpenAnswers();
						}}
					>
						显示我的答案
					</Button>
				)}
				<ShareBtn characterName={resultCharacter} mbti={mbti} />
				<Button
					onClick={() => {
						report("card_open");
						onOpenCard();
					}}
					className="result-accent-btn"
				>
					生成灵魂卡片
				</Button>
			</div>
		</div>
	);
}
