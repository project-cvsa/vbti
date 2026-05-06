import { useState } from "react";
import { createRoot } from "react-dom/client";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAtomValue } from "jotai";
import { resultPaletteAtom } from "@/state/atoms";

type ConfirmOptions = {
	/** Dialog title, defaults to "确认操作" */
	title?: string;
	/** Dialog description / body text */
	description?: string;
	/** Confirm button label, defaults to "确认" */
	confirmText?: string;
	/** Cancel button label, defaults to "取消" */
	cancelText?: string;
	/** Confirm button variant, defaults to "default". Use "destructive" for dangerous actions. */
	variant?: "default" | "destructive";
};

/**
 * Show a confirmation dialog imperatively, similar to `window.confirm()`.
 *
 * Returns `true` if the user clicks Confirm, `false` otherwise.
 * No component management needed — the dialog creates and destroys itself.
 *
 * @example
 * const ok = await confirm({ title: "删除记录", description: "此操作不可撤销", variant: "destructive" });
 * if (ok) { /* delete ... *‍/ }
 */
export function confirm({
	title = "确认操作",
	description,
	confirmText = "确认",
	cancelText = "取消",
	variant = "default",
}: ConfirmOptions = {}): Promise<boolean> {
	return new Promise<boolean>((resolve) => {
		const container = document.createElement("div");
		document.body.appendChild(container);
		const root = createRoot(container);

		let settled = false;

		const cleanup = () => {
			root.unmount();
			container.remove();
		};

		const finish = (value: boolean) => {
			if (settled) return;
			settled = true;
			resolve(value);
			// Delay cleanup to allow close animation to play (duration-100 ≈ 100ms)
			setTimeout(cleanup, 200);
		};

		root.render(
			<ConfirmDialog
				title={title}
				description={description}
				confirmText={confirmText}
				cancelText={cancelText}
				variant={variant}
				onResolve={finish}
			/>,
		);
	});
}

function ConfirmDialog({
	title,
	description,
	confirmText,
	cancelText,
	variant,
	onResolve,
}: ConfirmOptions & { onResolve: (value: boolean) => void }) {
	const [open, setOpen] = useState(true);

	const close = (value: boolean) => {
		setOpen(false);
		onResolve(value);
	};

	const palette = useAtomValue(resultPaletteAtom);

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) close(false);
			}}
		>
			<DialogContent
				showCloseButton={false}
				onPointerDownOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => close(false)}>
						{cancelText}
					</Button>
					<Button variant={variant} style={{ backgroundColor: palette?.accent }} onClick={() => close(true)}>
						{confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
