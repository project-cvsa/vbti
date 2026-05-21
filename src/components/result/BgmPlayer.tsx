import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Music, VolumeX } from "lucide-react";
import type { ResultPalette } from "@/core/color";
import { report } from "@/lib/telemetry";

const isRedNote = import.meta.env.MODE.startsWith("rednote");

interface SongInfo {
	name: string;
	bv: string;
}

function parseSongs(bgm: string): SongInfo[] {
	return bgm
		.split("\n")
		.filter((line) => line.trim() !== "")
		.map((line) => {
			const parts = line.split("|");
			return { name: (parts[0] || "").trim(), bv: (parts[1] || "").trim() };
		})
		.filter((s) => s.name && s.bv);
}

interface BgmPlayerProps {
	music: string;
	bgm: string;
	palette: ResultPalette | null;
}

export function BgmPlayer({ music, bgm, palette }: BgmPlayerProps) {
	const [musicPlaying, setMusicPlaying] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const songs = parseSongs(bgm);

	useEffect(() => {
		const audio = new Audio(music);
		audio.loop = true;
		audio.volume = 0.7;
		audio.play().catch((e) => {
			console.error(e);
		});
		audioRef.current = audio;

		audio.addEventListener("playing", () => setMusicPlaying(true));
		audio.addEventListener("pause", () => setMusicPlaying(false));

		return () => {
			audio.pause();
			audio.currentTime = 0;
		};
	}, [music]);

	const toggleMusic = useCallback(() => {
		report("result_bgm_toggle");
		const audio = audioRef.current;
		if (!audio) return;
		audio.addEventListener("playing", () => setMusicPlaying(true));
		audio.addEventListener("pause", () => setMusicPlaying(false));
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

	return (
		<div className="mt-4">
			<div className="flex items-center gap-3 mb-2">
				<span className="text-base font-bold">推荐歌单</span>
				<Button
					variant="outline"
					size="icon-sm"
					className="rounded-full"
					onClick={toggleMusic}
				>
					{musicPlaying ? <Music className="size-4" /> : <VolumeX className="size-4" />}
				</Button>
			</div>

			{musicPlaying && songs.length > 0 && (
				<div
					className="text-xs text-muted-foreground mb-2"
					style={palette ? { color: palette.muted } : undefined}
				>
					当前播放：{songs[0].name}
				</div>
			)}

			<div className="flex flex-wrap gap-2">
				{songs.map((song) => (
					<a
						key={song.bv}
						href={`https://www.bilibili.com/video/${song.bv}`}
						target="_blank"
						onClick={() =>
							report("link_click", { link: `歌曲观看-${song.bv}`, bvid: song.bv })
						}
						rel="noopener noreferrer"
						className="inline-flex items-center px-4 py-2 rounded-full border 
						text-xs font-semibold no-underline transition-colors result-song-pill"
					>
						{song.name}
					</a>
				))}
			</div>

			{!isRedNote && (
				<div
					className="text-xs text-muted-foreground mt-2"
					style={palette ? { color: palette.muted } : undefined}
				>
					↑点击歌曲前往B站观看
				</div>
			)}
		</div>
	);
}
