import type { Plugin } from "postcss";

/**
 * 将 CSS Media Queries Level 4 的 Range Syntax 转换为 Level 3 传统语法
 * 支持: (width >= 48rem), (height < 100vh), (20rem <= width < 50rem) 等
 */
export const rangeToLegacy = (params: string): string => {
	// 1. 处理双端区间: (20rem <= width <= 50rem)
	// 匹配: [数值1] [符号1] [属性] [符号2] [数值2]
	const complexRangeRegex = /\(\s*([^\s<>]+)\s*(<=|<)\s*(width|height)\s*(<=|<)\s*([^\s<>]+)\s*\)/g;

	let processed = params.replace(complexRangeRegex, (_, val1, op1, prop, op2, val2) => {
		const minPart = op1 === '<=' ? `(min-${prop}: ${val1})` : `(min-${prop}: ${val1})`; // 注: 严格大于通常在此简写
		const maxPart = op2 === '<=' ? `(max-${prop}: ${val2})` : `(max-${prop}: ${val2})`;
		return `${minPart} and ${maxPart}`;
	});

	// 2. 处理单向范围: (width >= 48rem)
	// 匹配: [属性] [符号] [数值]
	const simpleRangeRegex = /\(\s*(width|height)\s*(>=|<=|>|<)\s*([^\s<>]+)\s*\)/g;

	processed = processed.replace(simpleRangeRegex, (_, prop, op, value) => {
		switch (op) {
			case '>=':
			case '>':
				return `(min-${prop}: ${value})`;
			case '<=':
			case '<':
				return `(max-${prop}: ${value})`;
			default:
				return _;
		}
	});

	// 3. 处理数值在前的情况: (48rem <= width)
	const reverseRangeRegex = /\(\s*([^\s<>]+)\s*(>=|<=|>|<)\s*(width|height)\s*\)/g;

	processed = processed.replace(reverseRangeRegex, (_, value, op, prop) => {
		switch (op) {
			case '<=':
			case '<':
				return `(min-${prop}: ${value})`;
			case '>=':
			case '>':
				return `(max-${prop}: ${value})`;
			default:
				return _;
		}
	});
	return processed;
};

export const rangePolyfill = (): Plugin => {
	return {
		postcssPlugin: "postcss-range-polyfill",
		AtRule(atRule) {
			//if (atRule.name === "media") console.log(atRule.params, rangeToLegacy(atRule.params));
			if (atRule.name === "media") {
				atRule.params = rangeToLegacy(atRule.params);
			}
		},
	};
};