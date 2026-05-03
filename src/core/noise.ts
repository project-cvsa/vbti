export const createNoise4D = (seed: number = Math.random()) => {
	const p = new Uint8Array(512);
	const permutation = Array.from({ length: 256 }, (_, i) => i);

	let s = seed;
	for (let i = 255; i > 0; i--) {
		s = (s * 1103515245 + 12345) & 0x7fffffff;
		const j = s % (i + 1);
		[permutation[i], permutation[j]] = [permutation[j], permutation[i]];
	}

	for (let i = 0; i < 512; i++) p[i] = permutation[i & 255];

	const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
	const lerp = (t: number, a: number, b: number) => a + t * (b - a);

	const grad4D = (hash: number, x: number, y: number, z: number, w: number) => {
		const h = hash & 31;
		const u = h < 24 ? x : y;
		const v = h < 16 ? y : z;
		const s = h < 8 ? z : w;
		return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v) + ((h & 4) === 0 ? s : -s);
	};

	return (x: number, y: number, z: number, w: number): number => {
		const xi = Math.floor(x) & 255;
		const yi = Math.floor(y) & 255;
		const zi = Math.floor(z) & 255;
		const wi = Math.floor(w) & 255;

		const xf = x - Math.floor(x);
		const yf = y - Math.floor(y);
		const zf = z - Math.floor(z);
		const wf = w - Math.floor(w);

		const u = fade(xf);
		const v = fade(yf);
		const t = fade(zf);
		const r = fade(wf);

		const A = p[xi] + yi,
			AA = p[A] + zi,
			AAA = p[AA] + wi,
			AAB = p[AA + 1] + wi;
		const AB = p[A + 1] + zi,
			ABA = p[AB] + wi,
			ABB = p[AB + 1] + wi;
		const B = p[xi + 1] + yi,
			BA = p[B] + zi,
			BAA = p[BA] + wi,
			BAB = p[BA + 1] + wi;
		const BB = p[B + 1] + zi,
			BBA = p[BB] + wi,
			BBB = p[BB + 1] + wi;

		const raw = lerp(
			r,
			lerp(
				t,
				lerp(
					v,
					lerp(u, grad4D(p[AAA], xf, yf, zf, wf), grad4D(p[BAA], xf - 1, yf, zf, wf)),
					lerp(
						u,
						grad4D(p[ABA], xf, yf - 1, zf, wf),
						grad4D(p[BBA], xf - 1, yf - 1, zf, wf)
					)
				),
				lerp(
					v,
					lerp(
						u,
						grad4D(p[AAB], xf, yf, zf - 1, wf),
						grad4D(p[BAB], xf - 1, yf, zf - 1, wf)
					),
					lerp(
						u,
						grad4D(p[ABB], xf, yf - 1, zf - 1, wf),
						grad4D(p[BBB], xf - 1, yf - 1, zf - 1, wf)
					)
				)
			),
			lerp(
				t,
				lerp(
					v,
					lerp(
						u,
						grad4D(p[AAA + 1], xf, yf, zf, wf - 1),
						grad4D(p[BAA + 1], xf - 1, yf, zf, wf - 1)
					),
					lerp(
						u,
						grad4D(p[ABA + 1], xf, yf - 1, zf, wf - 1),
						grad4D(p[BBA + 1], xf - 1, yf - 1, zf, wf - 1)
					)
				),
				lerp(
					v,
					lerp(
						u,
						grad4D(p[AAB + 1], xf, yf, zf - 1, wf - 1),
						grad4D(p[BAB + 1], xf - 1, yf, zf - 1, wf - 1)
					),
					lerp(
						u,
						grad4D(p[ABB + 1], xf, yf - 1, zf - 1, wf - 1),
						grad4D(p[BBB + 1], xf - 1, yf - 1, zf - 1, wf - 1)
					)
				)
			)
		);
		const normalized = (raw + 1) / 2;

		return normalized < 0 ? 0 : normalized >= 1 ? 1 : normalized;
	};
};