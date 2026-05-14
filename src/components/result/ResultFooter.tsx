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

function BiliUserPill({ img, name, uid }: { img: string; name: string; uid: string }) {
	return (
		<a
			className="flex items-center gap-1.5 md:gap-3 bg-[#fef3f9] border-[#ffd9ee] rounded-full border 
			md:px-7 md:py-2 w-fit px-4 py-1.5"
			href={`https://space.bilibili.com/${uid}`}
			target="_blank"
			rel="noopener noreferrer"
			onClick={() => report("link_click", { link: `B站链接_${name}` })}
		>
			<img
				src={img}
				referrerPolicy="no-referrer"
				alt={name}
				className="size-7 md:size-9 rounded-full object-cover flex-shrink-0"
			/>
			<div className="flex flex-col gap-0">
				<span className="text-base md:leading-5 font-medium text-[#3f2334]">{name}</span>
				<span className="max-md:hidden text-xs font-medium text-[#78586b]">UID{uid}</span>
			</div>
		</a>
	);
}

export function ResultFooter({ palette, onOpenStaff }: ResultFooterProps) {
	return (
		<div
			className="mt-5 pt-5 border-t border-accent-foreground/10"
			style={palette ? { borderColor: palette.line } : undefined}
		>
			<div className="flex flex-col items-center mt-5 mb-8">
				<div className="text-xl font-bold mb-3">主要制作者</div>
				<div
					className="md:flex md:gap-4 flex-wrap
					grid grid-cols-2 gap-y-2 gap-x-2 [&>*:nth-child(3)]:col-span-2 [&>*:nth-child(3)]:justify-self-center"
				>
					<BiliUserPill
						name="墨白茜兔"
						uid="870832"
						img="https://i0.hdslb.com/bfs/face/5516bedbd29d0c59ffe3a9cc68cc95def701f6f5.jpg"
					/>
					<BiliUserPill
						name="星火映渊"
						uid="600004959"
						img="https://i0.hdslb.com/bfs/face/8367e89c2e1bf4ddc14716df2a5e00932ce4ed5e.jpg"
					/>
					<BiliUserPill
						name="中V档案馆"
						uid="335075170"
						img="https://i1.hdslb.com/bfs/face/60aeb39a6df8f09076936510f0208ea4d58664c8.jpg"
					/>
				</div>
			</div>
			<div
				className="flex items-center justify-center gap-3 flex-wrap text-sm font-semibold mb-4"
				style={palette ? { color: palette.accent } : undefined}
			>
				<a
					href="https://www.bilibili.com/video/BV1of9hBQEsw"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1 hover:underline"
					onClick={() => report("link_click", { link: "关注作者_结果页" })}
				>
					<Tv className="size-4" />
					关注作者 / 反馈问题
				</a>
				<span className="opacity-0 md:opacity-50">·</span>
				<button
					type="button"
					className="inline-flex items-center gap-1 hover:underline"
					onClick={() => {
						report("staff_view");
						onOpenStaff();
					}}
				>
					<Heart className="size-4" />
					Staff与测试人员感谢
				</button>
				<span className="opacity-0 md:opacity-50">·</span>
				<a
					href="https://qm.qq.com/q/eV1JhoeM0g"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1 hover:underline"
					onClick={() => report("link_click", { link: "交流群_结果页" })}
				>
					加入VBTI交流群：747501305
				</a>
			</div>

			<div className="text-center mt-5">
				<div className="text-xl font-bold mb-3">你是谁？请关注更多V家资讯！</div>
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
