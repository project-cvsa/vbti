import { useEffect, useState, useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
	resultCharacterAtom,
	resultPaletteAtom,
	goToIntroAtom,
	restartTestAtom,
	answersAtom,
	fingerprintAtom,
} from "@/state/atoms";
import { characters } from "@/data/characters";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StaffModal, SoulCardModal, AnswersModal } from "@/components/modals";
import {
	CharacterHero,
	BgmPlayer,
	ResultActions,
	ResultFooter,
	Palette,
} from "@/components/result";
import { computeMBTI } from "@/core/mbti";
import { DATA_VERSION } from "@/data/ver";
import * as pkg from "../../../package.json";
import { report, submitStat } from "@/lib/telemetry";
import { confirm } from "@/components/ui/confirm";
import { charVideos } from "@/data/charVideos";
import { isDev } from "@/lib/utils";

const isBili = import.meta.env.MODE === "bilibili";

export default function ResultScreen() {
	const answers = useAtomValue(answersAtom);
	const thumbmark = useAtomValue(fingerprintAtom);
	const resultCharacter = useAtomValue(resultCharacterAtom);
	const goToIntro = useSetAtom(goToIntroAtom);
	const restartTest = useSetAtom(restartTestAtom);

	const [staffOpen, setStaffOpen] = useState(false);
	const [cardOpen, setCardOpen] = useState(false);
	const [answersOpen, setAnswersOpen] = useState(false);

	const character = resultCharacter ? characters[resultCharacter] : null;
	const palette = useAtomValue(resultPaletteAtom);

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

	const handleGoHome = useCallback(async () => {
		const confirmed = await confirm({
			title: "确认回到首页？",
			description: "当前结果将会丢失.",
		});
		if (!confirmed) return;
		report("go_home");
		goToIntro();
	}, [goToIntro]);

	const handleRestart = useCallback(async () => {
		const confirmed = await confirm({
			title: "确认重新测试？",
			description: "当前结果将会丢失.",
		});
		if (!confirmed) return;
		report("restart_test");
		restartTest();
	}, [restartTest]);

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

	function MoreInfoLink() {
		if (!character || !resultCharacter) return;
		if (!isBili) {
			return (
				<a
					href={character.url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-muted-foreground"
					style={{ color: palette?.muted }}
					onClick={() => report("link_click", { link: "百科", character })}
				>
					→点击了解关于ta的更多
				</a>
			);
		} else {
			return (
				<a
					href={charVideos[resultCharacter]}
					target="_blank"
					rel="noopener noreferrer"
					className="text-muted-foreground"
					style={{ color: palette?.muted }}
					onClick={() => report("link_click", { link: "角色介绍_哔哩哔哩", character })}
				>
					→点击了解关于ta的更多
				</a>
			);
		}
	}

	return (
		<Card className="md:p-6 ring-none ring-transparent shadow-none md:bg-white">
			<Palette />

			<CharacterHero>
				<div className="text-lg font-bold mb-1 mt-2">灵魂解读</div>
				<div className="text-base leading-relaxed whitespace-pre-wrap">
					{character.desc}
					<br />
					<MoreInfoLink />
				</div>
				<BgmPlayer music={character.music} bgm={character.bgm} palette={palette} />
			</CharacterHero>

			<ResultActions
				resultCharacter={resultCharacter}
				mbti={character.mbti}
				isDev={isDev}
				onGoHome={handleGoHome}
				onRestart={handleRestart}
				onOpenCard={() => setCardOpen(true)}
				onOpenAnswers={() => setAnswersOpen(true)}
			/>

			<ResultFooter palette={palette} onOpenStaff={() => setStaffOpen(true)} />

			<StaffModal
				open={staffOpen}
				onClose={() => setStaffOpen(false)}
				primaryText={palette?.accent ?? "#00a795"}
			/>

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
