import type { ReactNode } from "react";
import { CHAR_IMG_MAP } from "@/data/imgMap";
import { useAtomValue } from "jotai";
import { resultCharacterAtom, resultPaletteAtom } from "@/state/atoms";
import { characters } from "@/data/characters";

interface CharacterHeroProps {
	children?: ReactNode;
}

export function CharacterHero({ children }: CharacterHeroProps) {
	const resultCharacter = useAtomValue(resultCharacterAtom);
	const character = resultCharacter ? characters[resultCharacter] : null;
	const palette = useAtomValue(resultPaletteAtom);

	if (!resultCharacter || !character) {
		return;
	}

	return (
		<div className="flex flex-col md:grid md:grid-cols-[0.9fr_1.5fr] gap-6 items-start">
			<div
				className="hidden md:flex flex-col items-center text-center rounded-2xl p-5 bg-accent-20"
				style={palette ? { backgroundColor: palette.cardBg } : undefined}
			>
				<img
					src={CHAR_IMG_MAP[character.image] ?? ""}
					alt={resultCharacter}
					referrerPolicy="no-referrer"
					className="w-full max-w-65 max-h-[25rem] object-contain"
				/>
				<div
					className="mt-3 text-sm text-muted-foreground"
					style={palette ? { color: palette.muted } : undefined}
				>
					「{character.caption}」
				</div>
			</div>

			<div
				className="flex flex-col gap-4 text-accent-foreground"
				style={palette ? { color: palette.text } : undefined}
			>
				<div>
					<div
						className="text-base text-primary tracking-wider mb-1"
						style={palette ? { color: palette.accent } : undefined}
					>
						✨ 你的灵魂歌姬已降临
					</div>
					<h2 className="text-[2.7rem] leading-tight tracking-tight">{resultCharacter}</h2>
					<span
						className="inline-flex items-center gap-2 rounded-full px-4 py-2 border font-bold text-xs mt-2.5 bg-primary-10 border-primary-30 text-primary"
						style={
							palette
								? {
										backgroundColor: palette.badgeBg,
										borderColor: palette.badgeBorder,
										color: palette.accent,
									}
								: undefined
						}
					>
						{`歌手MBTI推测：${character.mbti}`}
					</span>
				</div>

				<div
					className="md:hidden flex flex-col items-center text-center py-5 rounded-lg bg-white-70"
					style={palette ? { backgroundColor: palette.cardBg } : undefined}
				>
					<img
						src={CHAR_IMG_MAP[character.image] ?? ""}
						alt={resultCharacter}
						referrerPolicy="no-referrer"
						className="w-full max-w-100 max-h-[25rem] object-contain"
					/>
					<div
						className="mt-3 text-sm text-muted-foreground"
						style={palette ? { color: palette.muted } : undefined}
					>
						「{character.caption}」
					</div>
				</div>
				<div
					style={palette ? { color: palette.text } : undefined}
				>
					{children}
				</div>
			</div>
		</div>
	);
}
