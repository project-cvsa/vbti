import { ArrowUpRight } from "lucide-react";
import type { ResultPalette } from "@/core/color";
import { report } from "@/lib/telemetry";

import { RedNote } from "../icon/RedNote";
import { Weibo } from "../icon/Weibo";
import { TikTok } from "../icon/TikTok";
import { Bili } from "../icon/Bili";

interface AuthorSocialGroupsProps {
	palette: ResultPalette | null;
}

const PlatformIconConfig = {
	Bilibili: {
		bg: "bg-[#f0f9ff]",
		text: "text-[#00aeec]",
		component: <Bili />,
	},
	RedNote: {
		bg: "bg-[#fff0f3]",
		text: "text-[#ff2442]",
		component: <RedNote />,
	},
	Weibo: {
		bg: "bg-[#fdf0ed]",
		text: "text-[#e6162d]",
		component: <Weibo />,
	},
	Douyin: {
		bg: "bg-[#f4f4f5]",
		text: "text-black",
		component: <TikTok />,
	},
};

function VerticalSocialRow({
	name,
	link,
	platform,
	label,
	palette,
}: {
	name: string;
	link: string;
	platform: string;
	label: string;
	palette: ResultPalette | null;
}) {
	const config = PlatformIconConfig[platform as keyof typeof PlatformIconConfig];

	return (
		<a
			href={link}
			target="_blank"
			rel="noopener noreferrer"
			className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 group w-full"
			onClick={() => report("link_click", { link: label })}
		>
			<div className="flex items-center gap-4">
				<div
					className={`size-11 flex items-center justify-center rounded-xl overflow-hidden flex-shrink-0 ${config?.bg || "bg-gray-50"}`}
				>
					<div
						className={`text-2xl flex items-center justify-center ${config?.text || "text-gray-600"}`}
					>
						{config?.component}
					</div>
				</div>
				<span className="text-lg font-medium text-gray-800 group-hover:text-black transition-colors">
					{name}
				</span>
			</div>
			<div
				className="flex items-center gap-1 text-[#2d6a4f] font-medium bg-[#f0f7f4] px-4 py-1.5 rounded-full text-sm group-hover:bg-[#e1efe9] transition-colors"
				style={
					palette?.accent
						? { color: palette.accent, backgroundColor: `${palette.accent}10` }
						: undefined
				}
			>
				<span>前往</span>
				<ArrowUpRight className="size-3.5" />
			</div>
		</a>
	);
}

export function AuthorSocialGroups({ palette }: AuthorSocialGroupsProps) {
	const authorGroups = [
		{
			id: "mobai",
			title: "墨白茜兔",
			links: [
				{
					name: "小红书",
					platform: "RedNote",
					link: "https://www.xiaohongshu.com/user/profile/68ada35d000000001900455a",
				},
				{
					name: "哔哩哔哩",
					platform: "Bilibili",
					link: "https://space.bilibili.com/870832",
				},
				{ name: "微博", platform: "Weibo", link: "https://weibo.com/u/2198016015" },
				{
					name: "抖音",
					platform: "Douyin",
					link: "https://www.douyin.com/user/MS4wLjABAAAADUtVKpRQGVNLWWjrbTu62CmCFq3MzoqPJRPNvfiHM2I",
				},
			],
		},
		{
			id: "xinghan",
			title: "星火映渊",
			links: [
				{
					name: "小红书",
					platform: "RedNote",
					link: "https://www.xiaohongshu.com/user/profile/63607dfb000000001802a79d",
				},
				{
					name: "哔哩哔哩",
					platform: "Bilibili",
					link: "https://space.bilibili.com/600004959",
				},
				{ name: "微博", platform: "Weibo", link: "https://weibo.com/u/7677086023" },
				{
					name: "抖音",
					platform: "Douyin",
					link: "https://www.douyin.com/user/MS4wLjABAAAAFF00QARp04atD8um2TwfjGk1aaHrAUKAWceS21E_9yz-O2vsa3ZKzzaAruk-gAnX",
				},
			],
		},
	];

	return (
		<div>
			<div className="text-center font-semibold text-2xl">主要制作者</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
				{authorGroups.map((group) => (
					<div key={group.id} className="flex flex-col gap-3.5">
						<h3 className="text-xl text-center mb-1">
							{group.title}
						</h3>
						<div className="flex flex-col gap-2.5">
							{group.links.map((item) => (
								<VerticalSocialRow
									key={item.name}
									name={item.name}
									link={item.link}
									platform={item.platform}
									label={`${group.title}_${item.name}链接`}
									palette={palette}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
