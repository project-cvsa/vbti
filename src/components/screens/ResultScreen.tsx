import { useEffect, useRef, useState, useCallback, useMemo } from "react";
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
import { generateResultPalette, type ResultPalette } from "@/core/color";
import { CHAR_IMG_MAP } from "@/data/imgMap";

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

	const palette: ResultPalette | null = useMemo(
		() => (character?.color ? generateResultPalette(character.color) : null),
		[character?.color]
	);

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
		if (!palette) return;

		const mq = window.matchMedia("(max-width: 768px)");
		const applyBg = () => {
			document.body.style.background = mq.matches ? palette.bodyBgSolid : palette.bodyBg;
		};
		applyBg();
		mq.addEventListener("change", applyBg);
		return () => {
			document.body.style.background = "";
			mq.removeEventListener("change", applyBg);
		};
	}, [palette]);

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

	const isDev = import.meta.env.MODE === "development" || window.location.pathname === "/dev";

	return (
		<Card className="md:p-6 ring-none ring-transparent shadow-none md:bg-white">
			{palette && (
				<style>{`
					.result-song-pill {
						background-color: ${palette.pill};
						color: ${palette.text};
						border-color: ${palette.line};
					}
					.result-song-pill:hover {
						background-color: ${palette.pillHover};
					}
					.result-accent-btn {
						background-color: ${palette.accent} !important;
						color: ${palette.accentForeground} !important;
					}
					.result-accent-btn:hover {
						background-color: ${palette.accentHover} !important;
						color: ${palette.accentForeground} !important;
					}
				`}</style>
			)}
			<div className="flex flex-col md:grid md:grid-cols-[0.9fr_1.5fr] gap-6 items-start">
				{/* Desktop poster */}
				<div className="hidden md:flex flex-col items-center text-center rounded-2xl p-5 bg-accent-20"
					style={palette ? { backgroundColor: palette.cardBg } : undefined}>
					<img
						src={CHAR_IMG_MAP[character.image] ?? ""}
						alt={resultCharacter}
						referrerPolicy="no-referrer"
						className="w-full max-w-65 max-h-[25rem] object-contain"
					/>
					<div className="mt-3 text-sm text-muted-foreground"
						style={palette ? { color: palette.muted } : undefined}>
						「{character.caption}」
					</div>
				</div>

				<div className="flex flex-col gap-4 text-accent-foreground"
					style={palette ? { color: palette.text } : undefined}>
					<div>
						<div className="text-base text-primary tracking-wider mb-1"
							style={palette ? { color: palette.accent } : undefined}>
							✨ 你的灵魂歌姬已降临
						</div>
						<h2 className="text-[2.7rem] leading-tight tracking-tight">
							{resultCharacter}
						</h2>
						<span className="inline-flex items-center gap-2 rounded-full px-4 py-2 border font-bold text-xs mt-2.5 bg-primary-10 border-primary-30 text-primary"
							style={palette ? {
								backgroundColor: palette.badgeBg,
								borderColor: palette.badgeBorder,
								color: palette.accent,
							} : undefined}>
							{`歌手MBTI推测：${character.mbti}`}
						</span>
					</div>

					{/* Mobile poster */}
					<div className="md:hidden flex flex-col items-center text-center py-5 rounded-lg bg-white-70"
						style={palette ? { backgroundColor: palette.cardBg } : undefined}>
						<img
							src={CHAR_IMG_MAP[character.image] ?? ""}
							alt={resultCharacter}
							referrerPolicy="no-referrer"
							className="w-full max-w-100 max-h-[25rem] object-contain"
						/>
						<div className="mt-3 text-sm text-muted-foreground"
							style={palette ? { color: palette.muted } : undefined}>
							「{character.caption}」
						</div>
					</div>

					<div>
						<div className="text-lg font-bold mb-1">灵魂解读</div>
						<div className="text-base leading-relaxed whitespace-pre-wrap">
							{character.desc}
						</div>
					</div>

					<div>
						<div className="flex items-center gap-3 mb-2">
							<span className="text-base font-bold">推荐歌单</span>
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
							<div className="text-xs text-muted-foreground mb-2"
								style={palette ? { color: palette.muted } : undefined}>
								当前播放：{songs[0].name}
							</div>
						)}

						<div className="flex flex-wrap gap-2">
							{songs.map((song) => (
								<a
									key={song.bv}
									href={`https://www.bilibili.com/video/${song.bv}`}
									target="_blank"
									onClick={() => report("link_click", { link: `歌曲观看-${song.bv}`, bvid: song.bv })}
									rel="noopener noreferrer"
									className="inline-flex items-center px-4 py-2 rounded-full border text-xs font-semibold no-underline transition-colors result-song-pill"
								>
									{song.name}
								</a>
							))}
						</div>
						<div className="text-xs text-muted-foreground mt-2"
							style={palette ? { color: palette.muted } : undefined}>
							↑点击歌曲前往B站观看
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-between gap-3 flex-wrap mt-5 items-center">
				<div className="flex gap-2">
					<Button
						onClick={() => { report("go_home"); goToIntro(); }}
						className="result-accent-btn"
					>
						回到首页
					</Button>
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
					<Button
						onClick={() => { report("card_open"); setCardOpen(true); }}
						className="result-accent-btn"
					>
						生成灵魂卡片
					</Button>
				</div>
			</div>

			<div className="mt-5 pt-5 border-t border-accent-foreground/10"
				style={palette ? { borderColor: palette.line } : undefined}>
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
						onClick={() => { report("staff_view"); setStaffOpen(true); }}
					>
						<Heart className="size-4" />
						Staff与测试人员感谢
					</Button>
				</div>
				<div className="text-center mb-4">
					<a href="https://qm.qq.com/q/eV1JhoeM0g" onClick={() => report("link_click", { link: "交流群_结果页" })} className="text-sm font-semibold"
						style={palette ? { color: palette.accent } : undefined}>
						加入VBTI交流群：747501305
					</a>
				</div>
				<div className="text-center mt-5">
					<div className="text-lg font-bold mb-3">你是谁？请关注更多V家资讯！</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
						<a
							href="https://www.bilibili.com/opus/1190997869366083605"
							target="_blank"
							rel="noopener noreferrer"
							className="block rounded-xl overflow-hidden border"
							onClick={() => report("link_click", { link: "2026夏浪派对" })}
						>
							<img
								src="https://i1.hdslb.com/bfs/new_dyn/f99551c63cbf8036ccde5ddfb7d9c606600004959.png@1e_1c.webp"
								referrerPolicy="no-referrer"
								alt="2026夏浪派对"
								className="w-full block"
							/>
						</a>
						<a
							href="https://space.bilibili.com/156489"
							target="_blank"
							rel="noopener noreferrer"
							className="block rounded-xl overflow-hidden border"
							onClick={() => report("link_click", { link: "中V周刊" })}
						>
							<img
								src="https://i1.hdslb.com/bfs/new_dyn/d841bbcf4ca849f8a1fc9aae7172adcb600004959.png@1e_1c.webp"
								referrerPolicy="no-referrer"
								alt="中V周刊"
								className="w-full block"
							/>
						</a>
						<a
							href="https://www.bilibili.com/blackboard/era/YAZ6jyAs8qVslK0r.html"
							target="_blank"
							rel="noopener noreferrer"
							className="block rounded-xl overflow-hidden border"
							onClick={() => report("link_click", { link: "术力口音乐大赛" })}
						>
							<img
								src="https://i1.hdslb.com/bfs/new_dyn/b43ff8af258fcc0fa90fcaf9ceb24a5d600004959.png@1e_1c.webp"
								referrerPolicy="no-referrer"
								alt="术力口音乐大赛"
								className="w-full block"
							/>
						</a>
						<a
							href="https://www.bilibili.com/blackboard/era/cb91Hht7tmJzNKqh.html"
							target="_blank"
							rel="noopener noreferrer"
							className="block rounded-xl overflow-hidden border"
							onClick={() => report("link_click", { link: "Vsinger创作激励" })}
						>
							<img
								src="https://i1.hdslb.com/bfs/new_dyn/faccd3bad0ed1417f8ff684f1268a917600004959.png@1e_1c.webp"
								referrerPolicy="no-referrer"
								alt="Vsinger创作激励"
								className="w-full block"
							/>
						</a>
					</div>
				</div>
			</div>

			<StaffModal open={staffOpen} onClose={() => setStaffOpen(false)} primaryText={palette?.accent ?? "#00a795"} />

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
