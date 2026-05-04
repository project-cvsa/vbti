import { useState, useCallback, useRef } from "react";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import type { Answers } from "@/core/types";
import {
	answeredCountAtom,
	answersAtom,
	currentQuestionIndexAtom,
	currentScreenAtom,
	resultCharacterAtom,
	secretResolvedAtom,
} from "@/state/atoms";
import { findMatchCharacter } from "@/core/findChar";
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
import ProbDistPanel from "@/components/test/ProbDistPanel";
import { SecretQuestionModal } from "@/components/modals/SecretQuestionModal";
import { computeMBTI } from "@/core/mbti";

export default function TestScreen() {
	const [answers, setAnswers] = useAtom(answersAtom);
	const answeredCount = useAtomValue(answeredCountAtom);
	const [currentIdx, setCurrentIdx] = useAtom(currentQuestionIndexAtom);
	const setScreen = useSetAtom(currentScreenAtom);
	const setResultCharacter = useSetAtom(resultCharacterAtom);
	const setSecretResolved = useSetAtom(secretResolvedAtom);

	const [showSecretQuestion, setShowSecretQuestion] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [showBackConfirm, setShowBackConfirm] = useState(false);
	const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

	const questionContainerRef = useRef<HTMLDivElement>(null);
	const total = questions.length;
	const answered = Object.keys(answers).length;
	const currentQuestion = questions[currentIdx];
	const savedAnswer = answers[currentQuestion.id];

	const mbtiResult = computeMBTI(answers);

	const handleAnswer = useCallback(
		(index: number) => {
			setAnswers((prev) => ({
				...prev,
				[currentQuestion.id]: index,
			}));
		},
		[currentQuestion.id, setAnswers]
	);

	const resolveCharacter = useCallback(
		(answers: Answers, secretCharacterName: string | null) => {
			if (secretCharacterName && characters[secretCharacterName]) {
				setResultCharacter(secretCharacterName);
				setSecretResolved(true);
				setScreen("result");
				return;
			}

			const char = findMatchCharacter(answers);
			setResultCharacter(char);
			setSecretResolved(false);
			setScreen("result");
		},
		[setResultCharacter, setSecretResolved, setScreen]
	);

	const handleSecretSelect = useCallback(
		(targetCharacter: string) => {
			setShowSecretQuestion(false);
			if (characters[targetCharacter]) {
				setResultCharacter(targetCharacter);
				setSecretResolved(true);
				setScreen("result");
			} else {
				resolveCharacter(answers, null);
			}
		},
		[answers, resolveCharacter, setResultCharacter, setSecretResolved, setScreen]
	);

	const handleSubmit = useCallback(() => {
		if (submitting) return;
		setSubmitting(true);
		if (answeredCount < questions.length) {
			setShowSubmitConfirm(true);
			return;
		}
		setSubmitting(false);
		resolveCharacter(answers, null);
	}, [answers, submitting, resolveCharacter, answeredCount]);

	const isDev = import.meta.env.DEV || window.location.pathname === "/dev"

	return (
		<div className="mt-5.5 p-6 max-sm:p-0 max-sm:mt-0 bg-white rounded-2xl max-sm:bg-transparent max-sm:rounded-none">
			<ProgressBar answered={answered} total={total} />

			<div className="flex flex-col md:flex-row gap-5 mt-4 max-sm:mt-2">
				<div className="flex-1 min-w-0">
					<div
						ref={questionContainerRef}
						className="rounded-2xl max-sm:rounded-none"
					>
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
								className=" text-white font-bold rounded-xl py-5 px-10"
								onClick={handleSubmit}
								disabled={submitting}
							>
								提交
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
				</div>
			</div>

			{showSecretQuestion && mbtiResult && secretQuestions[mbtiResult.mbti] && (
				<SecretQuestionModal
					open={showSecretQuestion}
					question={secretQuestions[mbtiResult.mbti]}
					onSelect={handleSecretSelect}
					onClose={() => { }}
				/>
			)}

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

			<Dialog open={showSubmitConfirm} onOpenChange={setShowSubmitConfirm}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle className="text-lg font-bold">确认提交</DialogTitle>
						<DialogDescription>
							目前还有未回答的问题，确定要提交并查看结果吗？<br />
							你可以跳过难以回答的问题。
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => {
							setSubmitting(false);
							setShowSubmitConfirm(false);
						}}>
							取消
						</Button>
						<Button
							onClick={() => {
								setSubmitting(false);
								resolveCharacter(answers, null);
							}}
						>
							确定
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{isDev && <div className="w-full shrink-0 md:sticky md:top-4 self-start">
				<ProbDistPanel />
			</div>}
		</div>
	);
}
