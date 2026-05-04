import type { ReactNode } from "react";

function AppShell({ children }: { children: ReactNode }) {
	return <div className="max-w-5xl mx-auto px-4 md:px-6 pb-16 md:pb-20 pt-5">{children}</div>;
}

export default AppShell;
