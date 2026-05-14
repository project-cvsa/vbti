import { useAtomValue } from "jotai";
import { resultPaletteAtom } from "@/state/atoms";
import { useEffect } from "react";

export function Palette() {
	const palette = useAtomValue(resultPaletteAtom);
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
	if (!palette) {
		return;
	}
	return (
		<style>
			{`
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
			`}
		</style>
	);
}
