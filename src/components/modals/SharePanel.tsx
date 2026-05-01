import { Button } from "@/components/ui/button";

interface SharePanelProps {
	open: boolean;
	onClose: () => void;
	characterName: string;
	mbti: string;
}

const SHARE_URL = "https://vbti-test.pages.dev";

const shareItems = [
	{ platform: "qq", icon: "🐧", label: "QQ" },
	{ platform: "wechat", icon: "💬", label: "微信" },
	{ platform: "bilibili", icon: "📺", label: "B站" },
	{ platform: "rednote", icon: "📕", label: "小红书" },
	{ platform: "copy", icon: "🔗", label: "复制链接" },
] as const;

export function SharePanel({ open, onClose, characterName, mbti }: SharePanelProps) {
	if (!open) return null;

	const shareText = `我的灵魂歌姬是「${characterName}」！${mbti}型人格，来看看你的是谁？`;

	const handleShare = async (platform: string) => {
		const fullText = `${shareText} ${SHARE_URL}`;

		if (platform === "copy") {
			await navigator.clipboard.writeText(SHARE_URL);
			alert("链接已复制！");
		} else {
			if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
				try {
					await navigator.share({
						title: "VBTI · 测测你的灵魂歌姬",
						text: shareText,
						url: SHARE_URL,
					});
				} catch {
					await navigator.clipboard.writeText(fullText);
					alert(
						`文案已复制，打开${platform === "qq" ? "QQ" : platform === "wechat" ? "微信" : platform === "bilibili" ? "B站动态" : "小红书"}粘贴分享吧～`
					);
				}
			} else {
				await navigator.clipboard.writeText(fullText);
				alert(
					`文案已复制，打开${platform === "qq" ? "QQ" : platform === "wechat" ? "微信" : platform === "bilibili" ? "B站动态" : "小红书"}粘贴分享吧～`
				);
			}
		}

		onClose();
	};

	return (
		<div
			className="fixed inset-0 z-2000"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
			onKeyDown={(e) => {
				if (e.key === "Escape") onClose();
			}}
		>
			<div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[22px] pt-6 px-4 pb-6 z-2000">
				<div className="flex justify-between items-center mb-4">
					<strong className="text-lg">分享到</strong>
					<Button
						variant="outline"
						className="bg-white text-[#1cbaa8] border border-[#81dfdd] rounded-xl px-4 py-2.5 font-semibold text-[13px]"
						onClick={onClose}
					>
						✕
					</Button>
				</div>
				<div className="flex gap-4 flex-wrap justify-center">
					{shareItems.map((item) => (
						<button
							type="button"
							key={item.platform}
							className="flex flex-col items-center gap-1.5 cursor-pointer bg-transparent border-none text-[13px] text-[#0d6362] p-2.5 rounded-xl transition-colors hover:bg-[#b0e8e7]"
							onClick={() => handleShare(item.platform)}
						>
							<span className="w-11 h-11 rounded-full flex items-center justify-center text-xl bg-[#b0e8e7]">
								{item.icon}
							</span>
							{item.label}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
