/** A single option within a question */
export interface QuestionOption {
	/** Option Description Text */
	label: string;
	/** MBTI dimension value: E/I/S/N/T/F/J/P, or empty string for special questions(e.g. q0)  */
	value: string;
	/** Language preference marker for cnScore/jpScore calculation */
	lang?: "CN" | "JP";
	/** Target character name (used in secret questions) */
	target?: string;
}

/** A question in the VBTI test */
export interface Question {
	id: string;
	text: string;
	options: QuestionOption[];
}

export type Answers = Record<string, number | undefined>;

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

export type CharLang = "CN" | "JP";

/** Character data used for matching */
export interface Character {
	/** MBTI type label (e.g., "ENFP") */
	mbti: string;
	/** Short tagline in Chinese */
	caption: string;
	image: string;
	/** Path to character's theme music file */
	music: string;
	/** Language group: CN (Chinese) or JP (Japanese) */
	lang: CharLang;
	/** BGM recommendation text with song names and BV numbers */
	bgm: string;
	/** Full character description in Chinese */
	desc: string;
	/** Short description for soul card generation */
	shortDesc: string;
	popularity?: number;
	color?: string;
	tags?: string;
	url?: string;
}

/**
 * A vector representing personality
 * Dimensions are: E, S, T, J
 * i.e. all positive value represent ESTJ
 */
export type MBTIVector = [number, number, number, number];

/** Result of computeMBTI() */
export interface MBTIResult {
	scores: MBTIScores;
	vector: MBTIVector;
	mbti: string;
}

export type CharacterProbDistribution = Record<string, number>;
export type Dist = CharacterProbDistribution;

/** Result of resolveCharacter() */
export interface CharacterResult {
	character: string;
	secretResolved: boolean;
}

/** Screen identifiers */
export type Screen = "intro" | "test" | "result";
