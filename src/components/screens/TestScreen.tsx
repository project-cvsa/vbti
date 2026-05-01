import { useState, useCallback, useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import type { MBTIResult } from "@/core/types";
import {
	answersAtom,
	currentQuestionIndexAtom,
	currentScreenAtom,
	resultCharacterAtom,
	secretResolvedAtom,
} from "@/state/atoms";
import { computeMBTI, getCandidates, findMatchCharacter } from "@/core/scoring";
import { questions } from "@/data/questions";
import { characters } from "@/data/characters";
import { secretQuestions } from "@/data/secretQuestions";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import ProgressBar from "@/components/test/ProgressBar";
import QuestionCard from "@/components/test/QuestionCard";
import { SecretQuestionModal } from "@/components/modals/SecretQuestionModal";
import { ENTJRevealModal } from "@/components/modals/ENTJRevealModal";

export default function TestScreen() {
	const [answers, setAnswers] = useAtom(answersAtom);
	const [currentIdx, setCurrentIdx] = useAtom(currentQuestionIndexAtom);
	const setScreen = useSetAtom(currentScreenAtom);
	const setResultCharacter = useSetAtom(resultCharacterAtom);
	const setSecretResolved = useSetAtom(secretResolvedAtom);

	const [showSecretQuestion, setShowSecretQuestion] = useState(false);
	const [entjPending, setEntjPending] = useState(false);
	const [mbtiResult, setMbtiResult] = useState<MBTIResult | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [showBackConfirm, setShowBackConfirm] = useState(false);

	const questionContainerRef = useRef<HTMLDivElement>(null);
	const total = questions.length;
	const answered = Object.keys(answers).length;
	const currentQuestion = questions[currentIdx];
	const savedAnswer = answers[currentQuestion.id];

	const handleAnswer = useCallback(
		(value: string, index: number) => {
			setAnswers((prev) => ({
				...prev,
				[currentQuestion.id]: { value, index },
			}));
		},
		[currentQuestion.id, setAnswers]
	);

	const resolveCharacter = useCallback(
		(mbti: MBTIResult, secretCharacterName: string | null) => {
			if (secretCharacterName && characters[secretCharacterName]) {
				setResultCharacter(secretCharacterName);
				setSecretResolved(true);
				setScreen("result");
				return;
			}

			if (mbti.mbti === "ENTJ") {
				setMbtiResult(mbti);
				setEntjPending(true);
				return;
			}

			const preferLang =
				mbti.cnScore > mbti.jpScore ? "CN" : mbti.jpScore > mbti.cnScore ? "JP" : null;

			const candidates = getCandidates(mbti.mbti, preferLang);

			if (candidates.length === 1) {
				setResultCharacter(candidates[0]);
				setSecretResolved(false);
				setScreen("result");
				return;
			}

			const match = findMatchCharacter(candidates, mbti.scores);
			setResultCharacter(match);
			setSecretResolved(false);
			setScreen("result");
		},
		[setResultCharacter, setSecretResolved, setScreen]
	);

	const handleEntjConfirm = useCallback(() => {
		setEntjPending(false);
		if (!mbtiResult) return;
		const char = mbtiResult.cnScore >= mbtiResult.jpScore ? "乐正龙牙" : "MEIKO";
		setResultCharacter(char);
		setSecretResolved(true);
		setScreen("result");
	}, [mbtiResult, setResultCharacter, setSecretResolved, setScreen]);

	const handleSecretSelect = useCallback(
		(targetCharacter: string) => {
			setShowSecretQuestion(false);
			if (characters[targetCharacter]) {
				setResultCharacter(targetCharacter);
				setSecretResolved(true);
				setScreen("result");
			} else if (mbtiResult) {
				resolveCharacter(mbtiResult, null);
			}
		},
		[mbtiResult, resolveCharacter, setResultCharacter, setSecretResolved, setScreen]
	);

	const handleSubmit = useCallback(() => {
		if (submitting) return;
		setSubmitting(true);

		let firstMissing = -1;
		for (let i = 0; i < questions.length; i++) {
			if (!answers[questions[i].id]) {
				firstMissing = i;
				break;
			}
		}

		if (firstMissing !== -1) {
			setCurrentIdx(firstMissing);
			setSubmitting(false);

			const container = questionContainerRef.current;
			if (container) {
				container.classList.add("ring-2", "ring-red-500", "bg-red-50/50");
				window.scrollTo({ top: container.offsetTop - 100, behavior: "smooth" });
				setTimeout(() => {
					container.classList.remove("ring-2", "ring-red-500", "bg-red-50/50");
				}, 2500);
			}
			return;
		}

		const result = computeMBTI(answers);
		setMbtiResult(result);

		const candidatesAfterMBTI = getCandidates(result.mbti, null);

		if (candidatesAfterMBTI.length > 1 && secretQuestions[result.mbti]) {
			setShowSecretQuestion(true);
			setSubmitting(false);
			return;
		}

		setSubmitting(false);
		resolveCharacter(result, null);
	}, [answers, submitting, resolveCharacter, setCurrentIdx]);

	return (
		<div className="mt-5.5 p-6 max-sm:p-0 max-sm:mt-0 bg-white rounded-2xl max-sm:bg-transparent max-sm:rounded-none">
			<ProgressBar answered={answered} total={total} />

			<div ref={questionContainerRef} className="rounded-2xl mt-4 max-sm:mt-2 max-sm:rounded-none">
				<QuestionCard
					question={currentQuestion}
					questionIndex={currentIdx}
					savedAnswer={savedAnswer}
					onAnswer={handleAnswer}
				/>
			</div>

			<div className="flex gap-3 mt-4.5 items-center justify-center flex-wrap">
				<div className="flex justify-between w-full items-center md:justify-center md:gap-4">
					<Button
						variant="outline"
						className="nav-btn px-5 py-3 rounded-2xl font-semibold"
						disabled={currentIdx === 0}
						onClick={() => setCurrentIdx((i) => i - 1)}
					>
						◀ 上一题
					</Button>
					<Button
						className=" text-white font-bold rounded-2xl py-5 px-4"
						onClick={handleSubmit}
						disabled={submitting}
					>
						提交并查看结果
					</Button>
					<Button
						variant="outline"
						className="nav-btn px-5 py-3 rounded-2xl font-semibold"
						disabled={currentIdx >= total - 1}
						onClick={() => setCurrentIdx((i) => i + 1)}
					>
						下一题 ▶
					</Button>
				</div>
				<Button
					variant="link"
					className="text-[#4a6b7a] text-sm hover:underline"
					onClick={() => setShowBackConfirm(true)}
				>
					返回首页
				</Button>
			</div>

			{showSecretQuestion && mbtiResult && secretQuestions[mbtiResult.mbti] && (
				<SecretQuestionModal
					open={showSecretQuestion}
					question={secretQuestions[mbtiResult.mbti]}
					onSelect={handleSecretSelect}
					onClose={() => {}}
				/>
			)}

			<ENTJRevealModal open={entjPending} onConfirm={handleEntjConfirm} />

			<Dialog open={showBackConfirm} onOpenChange={setShowBackConfirm}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>返回首页</DialogTitle>
						<DialogDescription>确定要返回首页吗？你的进度将会丢失。</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShowBackConfirm(false)}>
							取消
						</Button>
						<Button
							onClick={() => {
								setShowBackConfirm(false);
								setAnswers({});
								setCurrentIdx(0);
								setScreen("intro");
							}}
						>
							确定
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
