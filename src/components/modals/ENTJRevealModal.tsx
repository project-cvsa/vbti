import { Button } from "@/components/ui/button";

interface ENTJRevealModalProps {
	open: boolean;
	onConfirm: () => void;
}

export function ENTJRevealModal({ open, onConfirm }: ENTJRevealModalProps) {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-1000 flex items-center justify-center p-4 bg-[rgba(13,99,98,0.75)] backdrop-blur-md">
			<div className="bg-white rounded-[28px] max-w-140 w-full p-7 shadow-[0_30px_60px_rgba(28,186,168,0.28)] border border-[#81dfdd] text-center">
				<span className="inline-flex items-center gap-2 font-bold text-[13px] px-4 py-2 rounded-full mb-5">
					🔓 你解锁了终极隐藏！
				</span>
				<div className="text-base leading-relaxed text-[#0d6362] mb-4">
					你的 MBTI 推测为 <b>ENTJ</b> —— 天生的指挥官、战略家。
					<br />
					暂无歌姬与你完全共鸣，但你有一位最接近的灵魂之翼。
				</div>
				<Button
					className="w-full bg-[#1cbaa8] hover:bg-[#1cbaa8]/80 text-white font-bold rounded-2xl py-3.5 shadow-[0_14px_34px_rgba(28,186,168,0.25)]"
					onClick={onConfirm}
				>
					👇 查看相近共鸣歌姬
				</Button>
			</div>
		</div>
	);
}
