import { Heart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const staffData = [
	{ role: "策划&开发", names: ["Crimson茜（墨白茜兔）"] },
	{
		role: "核心内容协力",
		names: ["特瑞嗷", "周刊虚拟歌手中文曲排行榜", "诺诺小熊猫"],
	},
	{
		role: "测试感谢",
		names: [
			"花儿不哭",
			"-森久保行野-",
			"鬼面P",
			"CARDINAL星海",
			"Semaa小赛",
			"半只金蓝",
			"鱼丸君",
			"侨汣",
			"绿洲计划",
			"-朝尘-",
		],
	},
];

interface StaffModalProps {
	open: boolean;
	onClose: () => void;
}

export function StaffModal({ open, onClose }: StaffModalProps) {
	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (!o) onClose();
			}}
		>
			<DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="inline-flex items-center gap-2">
						<Heart className="size-4 text-primary" />
						Staff与测试人员感谢
					</DialogTitle>
				</DialogHeader>

				<table className="w-full border-collapse">
					<tbody>
						{staffData.map((section) =>
							section.names.map((name, i) => (
								<tr key={`${section.role}-${name}`}>
									<td className="py-1.5 px-2 align-top text-sm leading-relaxed whitespace-nowrap">
										{i === 0 ? (
											<span className="font-bold text-primary">
												{section.role}：
											</span>
										) : null}
									</td>
									<td className="py-1.5 px-2 align-top text-sm leading-relaxed">
										{name}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</DialogContent>
		</Dialog>
	);
}
