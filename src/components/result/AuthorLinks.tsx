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
		component: (
			<div className="text-[22px]">
				<Bili />
			</div>
		),
	},
	RedNote: {
		bg: "bg-[#fff0f3]",
		text: "text-[#ff2442]",
		component: (
			<div className="text-[28px]">
				<RedNote />
			</div>
		),
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

function SocialIconLink({
	link,
	platform,
	label,
}: {
	link: string;
	platform: string;
	label: string;
}) {
	const config = PlatformIconConfig[platform as keyof typeof PlatformIconConfig];

	return (
		<a
			href={link}
			target="_blank"
			rel="noopener noreferrer"
			className={`size-12 flex items-center justify-center rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 flex-shrink-0 ${config?.bg || "bg-gray-50"}`}
			onClick={() => report("link_click", { link: label })}
		>
			<div
				className={`text-2xl flex items-center justify-center ${config?.text || "text-gray-600"}`}
			>
				{config?.component}
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
		<div className="mb-10">
			<div className="text-center font-semibold text-xl mb-2">主要制作者</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
				{authorGroups.map((group) => (
					<div key={group.id} className="flex flex-col items-center gap-3">
						<h3 className="text-lg text-center text-gray-800 font-medium">
							{group.title}
						</h3>
						<div className="flex items-center justify-center gap-4 w-full">
							{group.links.map((item) => (
								<SocialIconLink
									key={item.name}
									link={item.link}
									platform={item.platform}
									label={`${group.title}_${item.name}链接`}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
