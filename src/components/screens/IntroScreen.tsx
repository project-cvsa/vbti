import { useSetAtom } from "jotai";
import { restartTestAtom } from "@/state/atoms";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tv } from "lucide-react";
import * as pkg from "../../../package.json";

function IntroScreen() {
	const restart = useSetAtom(restartTestAtom);

	return (
		<div className="h-[70vh] flex flex-col justify-center items-center text-center mt-5">
			<Card className="relative overflow-hidden w-full h-full bg-white max-sm:px-4">
				{/* Decorative gradient circle — desktop only */}
				<div className="absolute -right-17.5 -top-17.5 w-55 h-55 rounded-full pointer-events-none bg-linear-to-b from-primary/20 to-primary/5" />

				<div className="flex-1 flex flex-col justify-end items-center pb-5 z-10">
					<h1 className="text-[clamp(34px,6vw,48px)] leading-[1.12] tracking-[-0.03em] text-primary max-w-2xl mb-3.5 font-bold">
						VBTI · 测测你的灵魂歌姬
					</h1>
					<p className="text-muted-foreground text-base leading-relaxed max-w-150">
						39道题，深入你的术力口人格。
						<br />
						测出那位与你灵魂共振的虚拟歌姬。
					</p>
				</div>

				<div className="relative z-10 mb-1">
					<Button onClick={() => {
						restart();
						if (window._bgmAudio) {
							window._bgmAudio.play();
						}
					}} size="lg" className="px-10 py-6 text-lg font-bold">
						开始测试
					</Button>
				</div>

				<p className="text-muted-foreground text-xs mt-1 mb-4 z-10 px-6 max-sm:px-0">
					测试结果仅供参考。愿你无论测出哪位歌姬，都能在自己的世界闪闪发光
				</p>

				<div className="flex-1 flex flex-col items-center pt-5 pb-3 z-10">
					<div className="flex flex-col items-center gap-2">
						<a
							href="https://www.bilibili.com/video/BV1of9hBQEsw"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary text-xs font-semibold hover:underline inline-flex items-center gap-1"
						>
							<Tv className="size-3.5" />
							关注作者 / 反馈问题
						</a>
						<span className="text-primary text-xs font-semibold">
							加入VBTI交流群：747501305
						</span>
					</div>
					<p className="mt-2 text-muted-foreground text-[11px]">
						版本：v{pkg.version} &nbsp;&nbsp;| &nbsp;&nbsp;bgm：拼凑的断音 - Toa
					</p>
				</div>
			</Card>
		</div>
	);
}

export default IntroScreen;
