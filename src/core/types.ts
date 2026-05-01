/** A single option within a question */
export interface QuestionOption {
	label: string;
	/** MBTI dimension value: E/I/S/N/T/F/J/P, or CN/JP for language markers */
	value: string;
	/** Language preference marker for cnScore/jpScore calculation */
	lang?: "CN" | "JP";
	/** Legacy language marker for q31/q32 */
	isCN?: boolean;
	/** Legacy language marker for q31/q32 */
	isJP?: boolean;
	/** Optional per-option weight (used in q39) */
	weight?: number;
	/** Optional vibe tag (used in q39) */
	vibe?: string;
	/** Target character name (used in secret questions) */
	target?: string;
}

/** A question in the VBTI test */
export interface Question {
	id: string;
	/** MBTI dimension this question tests */
	dim: string;
	text: string;
	options: QuestionOption[];
}

/** A user's answer to a question */
export interface Answer {
	value: string;
	index: number;
}

/** MBTI sub-scores for each dimension pole */
export interface MBTIScores {
	E: number;
	I: number;
	S: number;
	N: number;
	T: number;
	F: number;
	J: number;
	P: number;
}

/** Character data used for matching */
export interface Character {
	/** MBTI type label (e.g., "ENFP") */
	mbti: string;
	/** Introversion-Extraversion score (50 = neutral) >50 = E  */
	ie: number;
	/** Intuition-Sensing score (50 = neutral) >50 = N */
	ns: number;
	/** Feeling-Thinking score (50 = neutral) >50 = F */
	ft: number;
	/** Perceiving-Judging score (50 = neutral) >50 = P */
	pj: number;
	/** Short tagline in Chinese */
	caption: string;
	/** Path to character's theme music file */
	music: string;
	/** Matching weight bias (subtracted from distance) */
	weight: number;
	/** Language group: CN (Chinese) or JP (Japanese) */
	lang: "CN" | "JP";
	/** BGM recommendation text with song names and BV numbers */
	bgm: string;
	/** Full character description in Chinese */
	desc: string;
	/** Short description for soul card generation */
	shortDesc: string;
}

/** Result of computeMBTI() */
export interface MBTIResult {
	scores: MBTIScores;
	mbti: string;
	cnScore: number;
	jpScore: number;
}

/** Result of resolveCharacter() */
export interface CharacterResult {
	character: string;
	secretResolved: boolean;
}

/** Screen identifiers */
export type Screen = "intro" | "test" | "result";
