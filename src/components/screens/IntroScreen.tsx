import { useSetAtom } from "jotai";
import { restartTestAtom } from "@/state/atoms";
import { report } from "@/lib/telemetry";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tv } from "lucide-react";
import * as pkg from "../../../package.json";

function IntroScreen() {
	const restart = useSetAtom(restartTestAtom);

	return (
		<div className="flex flex-col justify-center items-center text-center mt-5">
			<Card className="relative overflow-hidden w-full h-full bg-white max-md:px-4 pt-10 md:pt-15 mt-10">
				{/* Decorative gradient circle — desktop only */}
				<div className="absolute right-[-5rem] top-[-5rem] w-48 h-48 rounded-full 
				pointer-events-none bg-[linear-gradient(to_bottom,#00a79533,#00a79510)]" />

				<div className="flex-1 flex flex-col justify-end items-center pb-5 z-10 mt-5">
					<h1 className="text-[clamp(34px,6vw,48px)] leading-[1.12] tracking-[-0.03em] text-primary max-w-2xl mb-4 font-bold">
						VBTI · 测测你的灵魂歌姬
					</h1>
					<p className="text-muted-foreground text-base leading-relaxed max-w-150">
						39道题，深入你的术力口人格。
						<br />
						测出那位与你灵魂共振的虚拟歌姬。
					</p>
				</div>

				<div className="relative z-10 mb-1">
					<Button
						onClick={() => {
							report("start_test");
							restart();
							if (window._bgmAudio) {
								window._bgmAudio.play();
							}
						}}
						size="lg"
						className="px-10 py-6 text-lg font-bold"
					>
						开始测试
					</Button>
				</div>

				<p className="text-muted-foreground text-xs mt-1 mb-4 z-10 px-6 max-md:px-0">
					测试结果仅供参考。愿你无论测出哪位歌姬，都能在自己的世界闪闪发光
				</p>

				<div className="flex-1 flex flex-col items-center pt-5 pb-3 z-10">
					<div className="flex flex-col items-center gap-3">
						<a
							href="https://www.bilibili.com/video/BV1of9hBQEsw"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary font-semibold text-base hover:underline inline-flex items-center gap-1"
							onClick={() => report("link_click", { link: "关注作者_首页" })}
						>
							<Tv className="size-4" />
							关注作者 / 反馈问题
						</a>
						<a href="https://qm.qq.com/q/eV1JhoeM0g" onClick={() => report("link_click", { link: "交流群_首页" })}
							className="text-primary text-base font-semibold">
							加入VBTI交流群：747501305
						</a>
					</div>
					<p className="mt-6 text-muted-foreground text-[11px]">
						版本：v{pkg.version} &nbsp;&nbsp;| &nbsp;&nbsp;bgm：拼凑的断音 - Toa
					</p>
				</div>
			</Card>
		</div>
	);
}

export default IntroScreen;
