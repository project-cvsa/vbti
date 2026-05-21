import { useState, useCallback, useRef, useEffect } from "react";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import type { Answers } from "@/core/types";
import {
	answeredCountAtom,
	answersAtom,
	currentQuestionIndexAtom,
	currentScreenAtom,
	resultCharacterAtom,
	secretResolvedAtom,
	unansweredAtom,
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
import { QuestionZeroModal } from "@/components/modals/QuestionZeroModal";
import { computeMBTI } from "@/core/mbti";
import { ScrollArea } from "@/components/ui/scroll-area";
import { report } from "@/lib/telemetry";
import { isDev } from "@/lib/utils";

export default function TestScreen() {
	const [answers, setAnswers] = useAtom(answersAtom);
	const unanswered = useAtomValue(unansweredAtom);
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

	const q0Answered = answers["q0"] !== undefined;

	useEffect(() => {
		if (q0Answered && currentIdx === 0) {
			setCurrentIdx(1);
		}
	}, [q0Answered, currentIdx, setCurrentIdx]);

	const progressAnswered = answered - (q0Answered ? 1 : 0);
	const progressTotal = total - 1;

	const mbtiResult = computeMBTI(answers);

	const handleAnswer = useCallback(
		(index: number) => {
			if (currentQuestion.type === "multi") {
				setAnswers((prev) => {
					const current = prev[currentQuestion.id];
					const arr = Array.isArray(current) ? [...current] : [];
					if (arr.includes(index)) {
						return { ...prev, [currentQuestion.id]: arr.filter((i) => i !== index) };
					}
					return { ...prev, [currentQuestion.id]: [...arr, index] };
				});
			} else {
				setAnswers((prev) => ({
					...prev,
					[currentQuestion.id]: index,
				}));
			}
			report("answer", { questionId: currentQuestion.id, optionIndex: index });
		},
		[currentQuestion.id, currentQuestion.type, setAnswers]
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
			report("resolve", { char, answers });
		},
		[setResultCharacter, setSecretResolved, setScreen]
	);

	const handleSecretSelect = useCallback(
		(targetCharacter: string) => {
			setShowSecretQuestion(false);
			report("secret_answer", { target: targetCharacter });
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
		report("submit", { answeredCount });
		if (submitting) return;
		setSubmitting(true);
		if (answeredCount < questions.length) {
			setShowSubmitConfirm(true);
			setSubmitting(false);
			return;
		}
		setSubmitting(false);
		resolveCharacter(answers, null);
	}, [answers, submitting, resolveCharacter, answeredCount]);

	return (
		<div className="mt-6 p-6 max-md:p-0 max-md:mt-0 bg-white rounded-2xl max-md:bg-transparent max-md:rounded-none">
			<ProgressBar answered={progressAnswered} total={progressTotal} />

			<div className="flex flex-col md:flex-row gap-5 mt-4 max-md:mt-2">
				<div className="flex-1 min-w-0">
					<div ref={questionContainerRef} className="rounded-2xl max-md:rounded-none">
						<QuestionCard
							question={currentQuestion}
							questionIndex={currentIdx}
							savedAnswer={savedAnswer}
							onAnswer={handleAnswer}
						/>
					</div>

					<div className="flex gap-3 mt-5 items-center justify-center flex-wrap">
						<div className="flex justify-between w-full items-center md:justify-center md:gap-4">
							<Button
								variant="outline"
								className="nav-btn px-5 py-3 rounded-2xl font-semibold"
								disabled={currentIdx <= 1}
								onClick={() => {
									report("nav_prev", { from: currentIdx, to: currentIdx - 1 });
									setCurrentIdx((i) => i - 1);
								}}
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
								onClick={() => {
									report("nav_next", { from: currentIdx, to: currentIdx + 1 });
									setCurrentIdx((i) => i + 1);
								}}
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
					onClose={() => {}}
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
								report("abandon_test", { answeredCount });
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
					</DialogHeader>
					<ScrollArea className="max-h-[25rem]">
						<DialogDescription>
							目前还有未回答的问题，确定要提交并查看结果吗？
							<br />
							并非所有题目都必须回答，你可以跳过难以回答的问题。
							<br />
							<br />
							当前未回答的问题：
							<br />
							{unanswered.map((v) => {
								return (
									<>
										第{v}题: {questions[v].text}
										<br />
									</>
								);
							})}
						</DialogDescription>
					</ScrollArea>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setSubmitting(false);
								setShowSubmitConfirm(false);
							}}
						>
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

			<QuestionZeroModal
				open={!q0Answered}
				question={questions[0]}
				onSelect={(index) => {
					setAnswers((prev) => ({ ...prev, q0: index }));
					report("answer", { questionId: "q0", optionIndex: index });
					setCurrentIdx(1);
				}}
				onBack={() => {
					report("abandon_test", { answeredCount: 0 });
					setScreen("intro");
				}}
			/>

			{isDev && (
				<div className="w-full shrink-0 md:sticky md:top-4 self-start">
					<ProbDistPanel />
				</div>
			)}
		</div>
	);
}
