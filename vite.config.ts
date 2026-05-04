import path from "node:path";
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import layer from "@csstools/postcss-cascade-layers";
import postcssPresetEnv from "postcss-preset-env";
import postcssColorMixFunction from "@csstools/postcss-color-mix-function"
//@ts-expect-error missing ts
import minmax from "postcss-media-minmax";
import { rangePolyfill } from "./polyfill/range";
import tailwindcss from "tailwindcss";
import legacy from '@vitejs/plugin-legacy';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		babel({ presets: [reactCompilerPreset()] }),
		legacy({
			targets: "chrome >= 67, edge >= 79, firefox >= 75, safari >= 14",
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	css: {
		postcss: {
			plugins: [
				tailwindcss(),
				layer(),
				postcssPresetEnv({
					"browsers": [
						"chrome >= 67, edge >= 79, firefox >= 75, safari >= 14"
					]
				}),
				postcssColorMixFunction(),
				minmax(),
				rangePolyfill(),
			],
		},
	},
	build: {
		rolldownOptions: {
			output: {
				codeSplitting: {
					groups: [
						{
							name: 'react-vendor',
							test: /node_modules[\\/]react/,
							priority: 20,
						},
						{
							name: 'vendor',
							test: /node_modules/,
							priority: 10,
						},
						{
							name: 'common',
							minShareCount: 2,
							minSize: 10000,
							priority: 5,
						},
					],
				}
			}
		}
	}
});
