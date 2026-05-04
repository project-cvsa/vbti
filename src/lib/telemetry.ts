import { getDefaultStore } from "jotai";
import { fingerprintAtom } from "@/state/atoms";

function getSessionId(): string {
	const key = "vbti_sid";
	let sid = sessionStorage.getItem(key);
	if (!sid) {
		if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
			sid = crypto.randomUUID();
		} else {
			sid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
		}
		sessionStorage.setItem(key, sid);
	}
	return sid;
}

function basePayload() {
	const fingerprint = (() => {
		try {
			return getDefaultStore().get(fingerprintAtom);
		} catch {
			return undefined;
		}
	})();
	return {
		fingerprint,
		timestamp: new Date().toISOString(),
		sessionId: getSessionId(),
		mode: import.meta.env.MODE,
	};
}

const BATCH_SIZE = 10;
const FLUSH_MS = 5000;
const MAX_BUFFER = 1000;

const buffer: Record<string, unknown>[] = [];
let timer: ReturnType<typeof setInterval> | null = null;
let listenersReady = false;

function ensureListeners() {
	if (listenersReady) return;
	listenersReady = true;
	window.addEventListener("beforeunload", flushForUnload);
	window.addEventListener("pagehide", flushForUnload);
}

function startTimer() {
	if (timer !== null) return;
	timer = setInterval(flush, FLUSH_MS);
}

function sendBatch(batch: Record<string, unknown>[]) {
	const url = new URL(import.meta.env.VITE_BACKEND_URL);
	url.pathname = "/access";
	const body = JSON.stringify(batch);
	const blob = new Blob([body], { type: "application/json" });
	return { url, body, blob };
}

function flush() {
	if (buffer.length === 0) return;
	const count = buffer.length;
	const batch = buffer.slice(0, count);

	try {
		const { url, body } = sendBatch(batch);
		fetch(url, {
			method: "POST",
			body,
			headers: { "Content-Type": "application/json" },
		})
			.then((res) => {
				if (res.ok) {
					buffer.splice(0, count);
				}
			})
			.catch(() => { });
	} catch { }

	if (buffer.length > MAX_BUFFER) {
		buffer.splice(0, buffer.length - MAX_BUFFER);
	}
}

function flushForUnload() {
	if (buffer.length === 0) return;
	const batch = buffer.splice(0);
	try {
		const { url, blob } = sendBatch(batch);
		navigator.sendBeacon(url, blob);
	} catch { }
}

export function report(
	actionType: string,
	actionData?: unknown,
	extra?: Record<string, unknown>,
) {
	ensureListeners();
	startTimer();

	buffer.push({
		...basePayload(),
		actionType,
		actionData: actionData ?? null,
		...extra,
	});

	if (buffer.length >= BATCH_SIZE) {
		flush();
	}
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function submitStat(data: Record<string, unknown>) {
	flush();
	try {
		const url = new URL(import.meta.env.VITE_BACKEND_URL);
		url.pathname = "/stat";
		fetch(url, {
			method: "POST",
			body: JSON.stringify({ ...basePayload(), ...data }),
			headers: { "Content-Type": "application/json" },
		}).catch(async () => {
			await sleep(2000)
			submitStat(data)
		});
	} catch {
		await sleep(2000)
		submitStat(data)
	}
}
