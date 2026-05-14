import { Button } from "@/components/ui/button";
import { Heart, Tv } from "lucide-react";
import type { ResultPalette } from "@/core/color";
import { report } from "@/lib/telemetry";

interface ResultFooterProps {
	palette: ResultPalette | null;
	onOpenStaff: () => void;
}

const promoItems = [
	{
		href: "https://www.bilibili.com/opus/1197677402486996998",
		src: "https://i1.hdslb.com/bfs/new_dyn/f99551c63cbf8036ccde5ddfb7d9c606600004959.png@1e_1c.webp",
		alt: "2026夏浪派对",
		link: "2026夏浪派对_新",
	},
	{
		href: "https://space.bilibili.com/156489",
		src: "https://i1.hdslb.com/bfs/new_dyn/d841bbcf4ca849f8a1fc9aae7172adcb600004959.png@1e_1c.webp",
		alt: "中V周刊",
		link: "中V周刊",
	},
	{
		href: "https://www.bilibili.com/blackboard/era/YAZ6jyAs8qVslK0r.html",
		src: "https://i1.hdslb.com/bfs/new_dyn/b43ff8af258fcc0fa90fcaf9ceb24a5d600004959.png@1e_1c.webp",
		alt: "术力口音乐大赛",
		link: "术力口音乐大赛",
	},
	{
		href: "https://www.bilibili.com/blackboard/era/cb91Hht7tmJzNKqh.html",
		src: "https://i1.hdslb.com/bfs/new_dyn/faccd3bad0ed1417f8ff684f1268a917600004959.png@1e_1c.webp",
		alt: "Vsinger创作激励",
		link: "Vsinger创作激励",
	},
];

export function ResultFooter({ palette, onOpenStaff }: ResultFooterProps) {
	return (
		<div
			className="mt-5 pt-5 border-t border-accent-foreground/10"
			style={palette ? { borderColor: palette.line } : undefined}
		>
			<div className="text-center mb-4">
				<a
					href="https://www.bilibili.com/video/BV1of9hBQEsw"
					target="_blank"
					rel="noopener noreferrer"
					className="font-semibold hover:underline inline-flex items-center gap-1"
					style={palette ? { color: palette.accent } : undefined}
					onClick={() => report("link_click", { link: "关注作者_结果页" })}
				>
					<Tv className="size-4" />
					关注作者 / 反馈问题
				</a>
			</div>
			<div className="text-center mb-4">
				<Button
					variant="link"
					className="inline-flex items-center gap-1"
					style={palette ? { color: palette.accent } : undefined}
					onClick={() => {
						report("staff_view");
						onOpenStaff();
					}}
				>
					<Heart className="size-4" />
					Staff与测试人员感谢
				</Button>
			</div>
			<div className="text-center mb-4">
				<a
					href="https://qm.qq.com/q/eV1JhoeM0g"
					target="_blank"
					rel="noopener noreferrer"
					onClick={() => report("link_click", { link: "交流群_结果页" })}
					className="text-sm font-semibold"
					style={palette ? { color: palette.accent } : undefined}
				>
					加入VBTI交流群：747501305
				</a>
			</div>
			<div className="text-center mt-5">
				<div className="text-lg font-bold mb-3">你是谁？请关注更多V家资讯！</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
					{promoItems.map((item) => (
						<a
							key={item.link}
							href={item.href}
							target="_blank"
							rel="noopener noreferrer"
							className="block rounded-xl overflow-hidden border"
							onClick={() => report("link_click", { link: item.link })}
						>
							<img
								src={item.src}
								referrerPolicy="no-referrer"
								alt={item.alt}
								className="w-full block"
							/>
						</a>
					))}
				</div>
			</div>
		</div>
	);
}
