import { useEffect, useRef, useState, useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { resultCharacterAtom, goToIntroAtom, restartTestAtom, answersAtom, fingerprintAtom } from "@/state/atoms";
import { characters } from "@/data/characters";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StaffModal } from "@/components/modals/StaffModal";
import { ShareBtn } from "@/components/ShareBtn";
import { SoulCardModal } from "@/components/modals/SoulCardModal";
import { Music, VolumeX, Heart, Tv } from "lucide-react";
import { AnswersModal } from "../modals/AnswersModal";
import { computeMBTI } from "@/core/mbti";
import { DATA_VERSION } from "@/data/ver";
import * as pkg from "../../../package.json";
import { report, submitStat } from "@/lib/telemetry";

interface SongInfo {
	name: string;
	bv: string;
}

export default function ResultScreen() {
	const answers = useAtomValue(answersAtom);
	const thumbmark = useAtomValue(fingerprintAtom);
	const resultCharacter = useAtomValue(resultCharacterAtom);
	const goToIntro = useSetAtom(goToIntroAtom);
	const restartTest = useSetAtom(restartTestAtom);

	const [staffOpen, setStaffOpen] = useState(false);
	const [cardOpen, setCardOpen] = useState(false);
	const [musicPlaying, setMusicPlaying] = useState(false);
	const [answersOpen, setAnswersOpen] = useState(false);

	const audioRef = useRef<HTMLAudioElement | null>(null);

	const character = resultCharacter ? characters[resultCharacter] : null;

	useEffect(() => {
		if (window._bgmAudio) {
			window._bgmAudio.pause();
		}
	}, []);

	useEffect(() => {
		if (!resultCharacter) return;
		if (thumbmark === undefined) return;
		const mbti = computeMBTI(answers);
		submitStat({ answers, resultCharacter, mbti, dataVer: DATA_VERSION, appVer: pkg.version });
	}, [resultCharacter, answers, thumbmark]);

	useEffect(() => {
		if (!character) return;

		const audio = new Audio(character.music);
		audio.loop = true;
		audio.volume = 0.6;
		audio.play().catch((e) => {
			console.error(e);
		});
		audioRef.current = audio;

		audio.addEventListener("playing", () => {
			setMusicPlaying(true);
		});
		audio.addEventListener("pause", () => {
			setMusicPlaying(false);
		});

		return () => {
			audio.pause();
			audio.currentTime = 0;
		};
	}, [character]);

	const toggleMusic = useCallback(() => {
		report("result_bgm_toggle");
		const audio = audioRef.current;
		if (!audio) return;
		audio.addEventListener("playing", () => {
			setMusicPlaying(true);
		});
		audio.addEventListener("pause", () => {
			setMusicPlaying(false);
		});
		if (audio.paused) {
			audio.play().catch((e) => {
				console.error(e);
			});
			setMusicPlaying(true);
		} else {
			audio.pause();
			setMusicPlaying(false);
		}
	}, []);

	if (!resultCharacter || !character) {
		return (
			<Card className="mt-6 p-6 text-center">
				<p className="text-muted-foreground">结果加载中...</p>
				<Button className="mt-4" onClick={() => goToIntro()}>
					回到首页
				</Button>
			</Card>
		);
	}

	const songLines = character.bgm
		? character.bgm.split("\n").filter((line) => line.trim() !== "")
		: [];
	const songs: SongInfo[] = songLines
		.map((line) => {
			const parts = line.split("|");
			return { name: (parts[0] || "").trim(), bv: (parts[1] || "").trim() };
		})
		.filter((s) => s.name && s.bv);

	const isDev = import.meta.env.DEV || window.location.pathname === "/dev";

	return (
		<Card className="mt-6 sm:p-6 ring-none ring-transparent shadow-none sm:bg-white">
			<div className="flex flex-col md:grid md:grid-cols-[0.9fr_1.5fr] gap-6 items-start">
				{/* Desktop poster */}
				<div className="hidden md:flex flex-col items-center text-center rounded-2xl p-5 bg-accent/20">
					<img
						src={character.image ?? ""}
						alt={resultCharacter}
						className="w-full max-w-65 max-h-100 object-contain"
					/>
					<div className="mt-3 text-muted-foreground text-sm">
						「{character.caption}」
					</div>
				</div>

				<div className="flex flex-col gap-4 text-accent-foreground">
					<div>
						<div className="text-sm text-primary tracking-wider mb-1">
							✨ 你的灵魂歌姬已降临{" "}
						</div>
						<h2 className="text-[clamp(32px,5vw,48px)] leading-tight tracking-tight">
							{resultCharacter}
						</h2>
						<span className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 bg-primary/20 border border-primary/30 text-primary font-bold text-xs mt-2.5">
							{`歌手MBTI推测：${character.mbti}`}
						</span>
					</div>

					{/* Mobile poster */}
					<div className="md:hidden flex flex-col items-center text-center py-5 rounded-lg bg-white/70">
						<img
							src={character.image ?? ""}
							alt={resultCharacter}
							className="w-full max-w-100 max-h-100 object-contain"
						/>
						<div className="mt-3 text-muted-foreground text-sm">
							「{character.caption}」
						</div>
					</div>

					<div>
						<div className="text-sm font-bold mb-1">灵魂解读</div>
						<div className="text-sm leading-relaxed whitespace-pre-wrap">
							{character.desc}
						</div>
					</div>

					<div>
						<div className="flex items-center gap-2.5 mb-1.5">
							<span className="text-sm font-bold">推荐歌单</span>
							<Button
								variant="outline"
								size="icon-sm"
								className="rounded-full"
								onClick={toggleMusic}
							>
								{musicPlaying ? (
									<Music className="size-4" />
								) : (
									<VolumeX className="size-4" />
								)}
							</Button>
						</div>

						{musicPlaying && songs.length > 0 && (
							<div className="text-xs text-muted-foreground mb-2">
								当前播放：{songs[0].name}
							</div>
						)}

						<div className="flex flex-wrap gap-2">
							{songs.map((song) => (
								<a
									key={song.bv}
									href={`https://www.bilibili.com/video/${song.bv}`}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center px-3.5 py-1.5 rounded-full border bg-accent 
									text-xs font-semibold no-underline transition-colors hover:bg-accent/70 border-accent-foreground/10"
								>
									{song.name}
								</a>
							))}
						</div>
						<div className="text-xs text-muted-foreground mt-1.5">
							点击歌曲前往B站观看
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-between gap-2.5 flex-wrap mt-5 items-center">
				<div className="flex gap-2">
					<Button onClick={() => { report("go_home"); goToIntro(); }}>回到首页</Button>
					<Button variant="outline" onClick={() => { report("restart_test"); restartTest(); }}>
						重新测试
					</Button>
				</div>
				<div className="flex gap-2">
					{isDev && (
						<Button variant="outline" onClick={() => { report("view_answers"); setAnswersOpen(true); }}>
							显示我的答案
						</Button>
					)}
					<ShareBtn characterName={resultCharacter} mbti={character.mbti} />
					<Button onClick={() => { report("card_open"); setCardOpen(true); }}>生成灵魂卡片</Button>
				</div>
			</div>

			<div className="mt-5 pt-5 border-t border-accent-foreground/10">
				<div className="text-center mb-4">
					<a
						href="https://www.bilibili.com/video/BV1of9hBQEsw"
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
					>
						<Tv className="size-4" />
						关注作者 / 反馈问题
					</a>
				</div>
				<div className="text-center mb-4">
					<Button
						variant="link"
						className="inline-flex items-center gap-1"
						onClick={() => { report("staff_view"); setStaffOpen(true); }}
					>
						<Heart className="size-4" />
						Staff与测试人员感谢
					</Button>
				</div>
				<div className="text-center mb-4">
					<span className="text-primary text-sm font-semibold">
						加入VBTI交流群：747501305
					</span>
				</div>
				<div className="text-center mt-5">
					<div className="text-lg font-bold mb-3">你是谁？请关注更多V家资讯！</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
						<a
							href="https://www.bilibili.com/opus/1190997869366083605"
							target="_blank"
							rel="noopener noreferrer"
							className="block rounded-xl overflow-hidden border"
						>
							<img
								src="/banner/xlpd-banner.webp"
								alt="2026夏浪派对"
								className="w-full block"
							/>
						</a>
						<a
							href="https://space.bilibili.com/156489"
							target="_blank"
							rel="noopener noreferrer"
							className="block rounded-xl overflow-hidden border"
						>
							<img
								src="/banner/zk-banner.webp"
								alt="中V周刊"
								className="w-full block"
							/>
						</a>
						<a
							href="https://www.bilibili.com/blackboard/era/YAZ6jyAs8qVslK0r.html"
							target="_blank"
							rel="noopener noreferrer"
							className="block rounded-xl overflow-hidden border"
						>
							<img
								src="/banner/shulikou.webp"
								alt="术力口音乐大赛"
								className="w-full block"
							/>
						</a>
						<a
							href="https://www.bilibili.com/blackboard/era/cb91Hht7tmJzNKqh.html"
							target="_blank"
							rel="noopener noreferrer"
							className="block rounded-xl overflow-hidden border"
						>
							<img
								src="/banner/Vsinger.webp"
								alt="Vsinger创作激励"
								className="w-full block"
							/>
						</a>
					</div>
				</div>
			</div>

			<StaffModal open={staffOpen} onClose={() => setStaffOpen(false)} />

			<SoulCardModal
				open={cardOpen}
				onClose={() => setCardOpen(false)}
				characterName={resultCharacter}
				character={character}
			/>
			<AnswersModal open={answersOpen} onClose={() => setAnswersOpen(false)} />
		</Card>
	);
}
