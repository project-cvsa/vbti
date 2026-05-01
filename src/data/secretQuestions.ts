import type { Question } from "@/core/types";

/** Hidden questions triggered when the computed MBTI matches certain types */
export const secretQuestions: Record<string, Question> = {
	INTP: {
		id: "secret_INTP",
		dim: "SECRET",
		text: "如果你在异世界里拥有一件属于自己的标志性物品，你觉得会是？",
		options: [
			{
				label: "一把未出鞘的短刀——不主动亮刃，但刀刃一直都在。",
				target: "言和",
				value: "",
			},
			{
				label: "一本总是翻到同一页的笔记本——不是没看完，是这一页值得反复读。",
				target: "墨清弦",
				value: "",
			},
			{
				label: "一个随身携带的整蛊道具箱——你永远不知道下一秒会发生什么。",
				target: "镜音连",
				value: "",
			},
		],
	},
};
