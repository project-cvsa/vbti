/** @type {import('tailwindcss').Config} */

// 透明度生成函数
function opacityVariants(baseColors) {
	const variants = {};
	const steps = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];

	Object.entries(baseColors).forEach(([name, value]) => {
		if (typeof value === "string") {
			variants[name] = { DEFAULT: value };
			steps.forEach((step) => {
				variants[name][step] = `${value.slice(0, value.length - 1)} / ${step}%)`;
			});
		} else if (typeof value === "object" && value !== null) {
			variants[name] = {};
			Object.entries(value).forEach(([subKey, subValue]) => {
				if (typeof subValue !== "string") return;
				if (subKey === "DEFAULT") {
					variants[name].DEFAULT = subValue;
				} else {
					variants[name][subKey] = subValue;
				}
				steps.forEach((step) => {
					variants[name][subKey === "DEFAULT" ? step : `${subKey}-${step}`] =
						`${subValue.slice(0, subValue.length - 1)} / ${step}%)`;
				});
			});
		}
	});

	return variants;
}

// 基础颜色定义
const baseColors = {
	background: "oklch(0.99 0.003 181.82)",
	foreground: "oklch(0.148 0.004 228.8)",
	card: {
		DEFAULT: "oklch(1 0 0)",
		foreground: "oklch(0.148 0.004 228.8)",
	},
	popover: {
		DEFAULT: "oklch(1 0 0)",
		foreground: "oklch(0.148 0.004 228.8)",
	},
	primary: {
		DEFAULT: "oklch(65.13% 0.1231 181.86)",
		foreground: "oklch(0.984 0.014 180.72)",
	},
	secondary: {
		DEFAULT: "oklch(0.967 0.001 286.375)",
		foreground: "oklch(0.21 0.006 285.885)",
	},
	muted: {
		DEFAULT: "oklch(0.963 0.002 197.1)",
		foreground: "oklch(0.56 0.021 213.5)",
	},
	accent: {
		DEFAULT: "oklch(94% 0.0435 185)",
		foreground: "oklch(45% 19% 194deg)",
	},
	destructive: "oklch(0.577 0.245 27.325)",
	border: "oklch(0.925 0.005 214.3)",
	input: "oklch(0.925 0.005 214.3)",
	ring: "oklch(0.723 0.014 214.4)",
	chart: {
		1: "oklch(0.872 0.007 219.6)",
		2: "oklch(0.56 0.021 213.5)",
		3: "oklch(0.45 0.017 213.2)",
		4: "oklch(0.378 0.015 216)",
		5: "oklch(0.275 0.011 216.9)",
	},
};

export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: opacityVariants(baseColors),
			borderRadius: {
				lg: "0.625rem",
				md: "calc(0.625rem * 0.8)",
				sm: "calc(0.625rem * 0.6)",
				xl: "calc(0.625rem * 1.4)",
				"2xl": "calc(0.625rem * 1.8)",
				"3xl": "calc(0.625rem * 2.2)",
				"4xl": "calc(0.625rem * 2.6)",
			},
			fontFamily: {
				sans: ["Inter Variable", "sans-serif"],
				heading: ["Inter Variable", "sans-serif"],
			},
		},
	},
	plugins: [],
};
