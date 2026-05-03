import { createNoise4D } from "@/core/noise";

const perlin4D = createNoise4D(1099);
const SCALE = 1.099;
const vector = [3, 4, 2, -5].map((v) => v / SCALE) as [number, number, number, number];
const result = perlin4D(...vector);
console.log(result);
