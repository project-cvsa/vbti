import { getDefaultStore } from "jotai";
import { fingerprintAtom } from "@/state/atoms";

/**
 * 生成跨页面导航保持不变的会话 ID（基于 sessionStorage）。
 * 浏览器关闭后自动清除。
 */
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

/** 上报事件的公共基础字段 */
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

function post(pathname: string, data: Record<string, unknown>) {
	try {
		const url = new URL(import.meta.env.VITE_BACKEND_URL);
		url.pathname = pathname;
		fetch(url, {
			method: "POST",
			body: JSON.stringify(data),
			headers: { "Content-Type": "application/json" },
		}).catch(() => {
			// 遥测上报失败不应中断应用
		});
	} catch {
		// 构造 URL 失败时静默忽略
	}
}

/**
 * 上报通用用户行为事件到 /access。
 *
 * @param actionType  事件类型，例如 "start_test" / "answer" / "submit"
 * @param actionData  事件附加数据，可选
 * @param extra       额外的顶层字段，可选
 */
export function report(
	actionType: string,
	actionData?: unknown,
	extra?: Record<string, unknown>,
) {
	post("/access", {
		...basePayload(),
		actionType,
		actionData: actionData ?? null,
		...extra,
	});
}

/**
 * 上报测试结果统计到 /stat（用于后台分析）。
 */
export function submitStat(data: Record<string, unknown>) {
	post("/stat", {
		...basePayload(),
		...data,
	});
}
