import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

const staffData = [
	{ role: "策划&开发", names: ["Crimson茜（墨白茜兔）"] },
	{ role: "新架构支持", names: ["星寒"] },
	{ role: "技术支持", names: ["中V档案馆"] },
	{
		role: "核心内容协力",
		names: ["特瑞嗷", "周刊虚拟歌手中文曲排行榜（失落的分别，物质的量_mol）", "变大河河", "诺诺小熊猫"],
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
			"诐狐"
		],
	},
];

interface StaffModalProps {
	open: boolean;
	onClose: () => void;
	primaryText: string;
}

export function StaffModal({ open, onClose, primaryText }: StaffModalProps) {
	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (!o) onClose();
			}}
		>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="inline-flex items-center gap-2 text-lg font-bold">
						♥️
						Staff与测试人员感谢
					</DialogTitle>
				</DialogHeader>
				<ScrollArea className="max-h-[80vh]">
					{staffData.map((section) => {
						return (
							<div key="">
								<span className="font-bold" style={{ color: primaryText }}>{section.role}</span>
								<br />
								{section.names.map((name) => (
									<span
										key={name}
										className="py-2 px-2 align-top text-sm leading-relaxed"
									>
										{name}
										<br />
									</span>
								))}
								<br />
							</div>
						);
					})}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
