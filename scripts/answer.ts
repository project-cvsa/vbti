import { findMatchCharacterRaw } from "@/core/findChar";
import { computeMBTI } from "@/core/mbti";
const ans = {
	"q0": {
		"value": "S",
		"index": 0
	},
	"q1": {
		"value": "J",
		"index": 0
	},
	"q2": {
		"value": "E",
		"index": 0
	},
	"q3": {
		"value": "E",
		"index": 0
	},
	"q4": {
		"value": "N",
		"index": 3
	},
	"q5": {
		"value": "N",
		"index": 1
	},
	"q6": {
		"value": "N",
		"index": 2
	},
	"q7": {
		"value": "I",
		"index": 1
	},
	"q8": {
		"value": "E",
		"index": 2
	},
	"q9": {
		"value": "E",
		"index": 0
	},
	"q10": {
		"value": "E",
		"index": 0
	},
	"q11": {
		"value": "E",
		"index": 0
	},
	"q12": {
		"value": "J",
		"index": 0
	},
	"q13": {
		"value": "T",
		"index": 2
	},
	"q14": {
		"value": "T",
		"index": 3
	},
	"q15": {
		"value": "T",
		"index": 0
	},
	"q16": {
		"value": "F",
		"index": 1
	},
	"q17": {
		"value": "T",
		"index": 2
	},
	"q18": {
		"value": "T",
		"index": 1
	},
	"q19": {
		"value": "S",
		"index": 0
	},
	"q20": {
		"value": "F",
		"index": 0
	},
	"q21": {
		"value": "P",
		"index": 2
	},
	"q22": {
		"value": "P",
		"index": 2
	},
	"q23": {
		"value": "P",
		"index": 0
	},
	"q24": {
		"value": "J",
		"index": 3
	},
	"q25": {
		"value": "P",
		"index": 0
	},
	"q26": {
		"value": "P",
		"index": 0
	},
	"q27": {
		"value": "P",
		"index": 1
	},
	"q28": {
		"value": "I",
		"index": 2
	},
	"q29": {
		"value": "E",
		"index": 0
	},
	"q30": {
		"value": "I",
		"index": 0
	},
	"q31": {
		"value": "S",
		"index": 0
	},
	"q32": {
		"value": "P",
		"index": 1
	},
	"q33": {
		"value": "S",
		"index": 1
	},
	"q34": {
		"value": "N",
		"index": 2
	},
	"q35": {
		"value": "S",
		"index": 0
	},
	"q36": {
		"value": "S",
		"index": 0
	},
	"q37": {
		"value": "S",
		"index": 0
	},
	"q38": {
		"value": "S",
		"index": 1
	},
	"q39": {
		"value": "E",
		"index": 0
	}
}
const [char, dist] = findMatchCharacterRaw(ans);
console.log(char, dist)
const mbti = computeMBTI(ans);
console.log(mbti)