import { useState, useEffect, useCallback, useRef } from "react";
import { Music, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { report } from "@/lib/telemetry";

declare global {
	interface Window {
		_bgmAudio?: HTMLAudioElement;
	}
}

interface BgmControlProps {
	visible?: boolean;
}

function BgmControl({ visible = true }: BgmControlProps) {
	const [playing, setPlaying] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		window._bgmAudio = document.getElementById("globalBgm") as HTMLAudioElement;
		const audio = window._bgmAudio;
		audio.volume = 0.6;
		audioRef.current = audio;
		if (audio) setPlaying(!audio.paused);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			const audio = audioRef.current;
			if (audio) setPlaying(!audio.paused);
		}, 500);
		return () => clearInterval(interval);
	}, []);

	const toggle = useCallback(() => {
		const audio = audioRef.current;
		if (!audio) return;
		if (audio.paused) {
			audio.play().catch(() => {});
		} else {
			audio.pause();
		}
		report("bgm_toggle");
	}, []);

	if (!visible) return null;

	return (
		<Button
			variant="outline"
			size="icon-lg"
			onClick={toggle}
			className="fixed bottom-6 left-6 z-50 size-13 rounded-full border-2 border-primary text-primary"
			aria-label={playing ? "暂停背景音乐" : "播放背景音乐"}
		>
			{playing ? <Pause className="size-5" /> : <Music className="size-5" />}
		</Button>
	);
}

export default BgmControl;
